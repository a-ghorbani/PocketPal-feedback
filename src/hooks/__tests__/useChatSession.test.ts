import {LlamaContext} from 'llama.rn';
import {renderHook, act} from '@testing-library/react-native';

import {textMessage} from '../../../jest/fixtures';

import {useChatSession} from '../useChatSession';

import {chatSessionStore, modelStore} from '../../store';

import {l10n} from '../../utils/l10n';
import {assistant} from '../../utils/chat';

const mockL10n = l10n.en;

const mockAssistant = {
  id: 'h3o3lc5xj',
};

beforeEach(() => {
  jest.clearAllMocks();
  modelStore.context = new LlamaContext({
    contextId: 1,
    gpu: false,
    reasonNoGPU: '',
    model: {},
  });
});

describe('useChatSession', () => {
  it('should send a message and update the chat session', async () => {
    const {result} = renderHook(() =>
      useChatSession(
        modelStore.context,
        {current: null},
        [],
        textMessage.author,
        mockAssistant,
      ),
    );

    await act(async () => {
      await result.current.handleSendPress(textMessage);
    });

    expect(chatSessionStore.addMessageToCurrentSession).toHaveBeenCalled();
    expect(modelStore.context?.completion).toHaveBeenCalled();
  });

  it('should handle model not loaded scenario', async () => {
    const {result} = renderHook(() =>
      useChatSession(null, {current: null}, [], textMessage.author, assistant),
    );

    await act(async () => {
      await result.current.handleSendPress(textMessage);
    });

    // TODO: fix this test:         "text": "Model not loaded. Please initialize the model.",
    expect(chatSessionStore.addMessageToCurrentSession).toHaveBeenCalledWith({
      author: assistant,
      createdAt: expect.any(Number),
      id: expect.any(String),
      text: mockL10n.modelNotLoaded,
      type: 'text',
      metadata: {system: true},
    });
  });

  it('should handle general errors during completion', async () => {
    const errorMessage = 'Some general error';
    if (modelStore.context) {
      modelStore.context.completion = jest
        .fn()
        .mockRejectedValueOnce(new Error(errorMessage));
    }

    const {result} = renderHook(() =>
      useChatSession(
        modelStore.context,
        {current: null},
        [],
        textMessage.author,
        mockAssistant,
      ),
    );

    await act(async () => {
      await result.current.handleSendPress(textMessage);
    });

    expect(chatSessionStore.addMessageToCurrentSession).toHaveBeenCalledWith(
      expect.objectContaining({
        text: `Completion failed: ${errorMessage}`,
        author: assistant,
      }),
    );
  });

  it('should buffer and flush tokens correctly', async () => {
    const timings = {token_per_second: '1'};
    if (modelStore.context) {
      modelStore.context.completion = jest
        .fn()
        .mockImplementation((params, onData) => {
          onData({token: 'Hello'});
          onData({token: ', '});
          onData({token: 'world!'});
          return Promise.resolve({timings: timings, usage: {}});
        });
    }

    const {result} = renderHook(() =>
      useChatSession(
        modelStore.context,
        {current: null},
        [],
        textMessage.author,
        mockAssistant,
      ),
    );

    await act(async () => {
      await result.current.handleSendPress(textMessage);
    });

    // Wait for all promises to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    expect(chatSessionStore.updateMessageToken).toHaveBeenCalled();
    expect(
      (chatSessionStore.updateMessageToken as jest.Mock).mock.calls.length,
    ).toBeGreaterThan(0);

    const concatenatedTokens = (
      chatSessionStore.updateMessageToken as jest.Mock
    ).mock.calls
      .map(call => call[0].token)
      .join(''); // Concatenate tokens

    expect(concatenatedTokens).toEqual('Hello, world!');

    const expectedMetadata = {timings: timings, copyable: true};

    const matchingCall = (
      chatSessionStore.updateMessage as jest.Mock
    ).mock.calls.find(
      ([, {metadata}]) =>
        metadata && metadata.timings && metadata.copyable === true,
    );

    expect(matchingCall).toBeDefined();
    expect(matchingCall[1].metadata).toEqual(expectedMetadata);
  });

  it('should reset the conversation', () => {
    const {result} = renderHook(() =>
      useChatSession(
        modelStore.context,
        {current: null},
        [],
        textMessage.author,
        mockAssistant,
      ),
    );

    result.current.handleResetConversation();

    expect(chatSessionStore.addMessageToCurrentSession).toHaveBeenCalledWith(
      expect.objectContaining({
        text: mockL10n.conversationReset,
        author: assistant,
      }),
    );
  });

  it('should not stop completion when inferencing is false', () => {
    const {result} = renderHook(() =>
      useChatSession(
        modelStore.context,
        {current: null},
        [],
        textMessage.author,
        mockAssistant,
      ),
    );

    result.current.handleStopPress();

    expect(modelStore.context?.stopCompletion).not.toHaveBeenCalled();
  });

  it('should set inferencing correctly during send', async () => {
    let resolveCompletion: (value: any) => void;
    const completionPromise = new Promise(resolve => {
      resolveCompletion = resolve;
    });

    if (modelStore.context) {
      modelStore.context.completion = jest
        .fn()
        .mockImplementation(() => completionPromise);
    }

    const {result} = renderHook(() =>
      useChatSession(
        modelStore.context,
        {current: null},
        [],
        textMessage.author,
        mockAssistant,
      ),
    );

    const sendPromise = act(async () => {
      await result.current.handleSendPress(textMessage);
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(result.current.inferencing).toBe(true);

    await act(async () => {
      resolveCompletion!({timings: {total: 100}, usage: {}});
      await sendPromise;
    });
    expect(result.current.inferencing).toBe(false);
  });
});
