import React from 'react';

import {LlamaContext} from 'llama.rn';
import {render, fireEvent, act, waitFor} from '../../../../jest/test-utils';
import {ChatScreen} from '../ChatScreen';

import {chatSessionStore, modelStore} from '../../../store';

import {l10n} from '../../../utils/l10n';

describe('ChatScreen', () => {
  let llamaRN;

  beforeEach(() => {
    jest.clearAllMocks();
    llamaRN = require('llama.rn');
  });

  it('renders correctly when model is not loaded', () => {
    const {getByText} = render(<ChatScreen />, {withNavigation: true});
    expect(getByText(l10n.en.pleaseLoadModel)).toBeTruthy();
  });

  it('renders correctly when model is loading', () => {
    modelStore.isContextLoading = true;
    const {getByPlaceholderText} = render(<ChatScreen />, {
      withNavigation: true,
    });
    expect(getByPlaceholderText(l10n.en.loadingModel)).toBeTruthy();
  });

  it('renders correctly when model is loaded', () => {
    modelStore.context = new LlamaContext({
      contextId: 1,
      gpu: false,
      reasonNoGPU: '',
      model: {},
    });
    const {getByPlaceholderText} = render(<ChatScreen />, {
      withNavigation: true,
    });
    expect(getByPlaceholderText(l10n.en.typeYourMessage)).toBeTruthy();
  });

  it('handles sending a message', async () => {
    modelStore.context = new LlamaContext({
      contextId: 1,
      gpu: false,
      reasonNoGPU: '',
      model: {},
    });
    modelStore.context.completion = jest.fn().mockResolvedValue({
      timings: {predicted_per_token_ms: 10, predicted_per_second: 100},
    });

    const {getByPlaceholderText, getByTestId} = render(<ChatScreen />, {
      withNavigation: true,
    });
    const input = getByPlaceholderText(l10n.en.typeYourMessage);

    await act(async () => {
      fireEvent.changeText(input, 'Hello, PocketPal AI!');
    });

    const sendButton = getByTestId('send-button');
    fireEvent.press(sendButton);

    expect(chatSessionStore.addMessageToCurrentSession).toHaveBeenCalledWith(
      expect.objectContaining({
        author: expect.objectContaining({id: 'y9d7f8pgn'}),
        text: 'Hello, PocketPal AI!',
      }),
    );

    await waitFor(() => {
      expect(modelStore.context).toBeTruthy();
      if (modelStore.context) {
        expect(modelStore.context.completion).toHaveBeenCalled();
      }
    });
  });

  it('handles sending a message failure', async () => {
    modelStore.context = new LlamaContext({
      contextId: 1,
      gpu: false,
      reasonNoGPU: '',
      model: {},
    });
    modelStore.context.completion = jest
      .fn()
      .mockRejectedValue(new Error('Completion failed'));

    const {getByPlaceholderText, getByTestId} = render(<ChatScreen />, {
      withNavigation: true,
    });
    const input = getByPlaceholderText(l10n.en.typeYourMessage);

    await act(async () => {
      fireEvent.changeText(input, 'Hello, PocketPal!');
    });

    const sendButton = getByTestId('send-button');
    await act(async () => {
      fireEvent.press(sendButton);
    });

    expect(chatSessionStore.addMessageToCurrentSession).toHaveBeenCalledWith(
      expect.objectContaining({
        author: expect.objectContaining({id: 'h3o3lc5xj'}),
        text: 'Completion failed: Completion failed',
        metadata: expect.objectContaining({system: true}),
      }),
    );
  });

  it('renders different message types correctly', async () => {
    modelStore.context = new LlamaContext({
      contextId: 1,
      gpu: false,
      reasonNoGPU: '',
      model: {},
    });
    jest
      .spyOn(chatSessionStore, 'currentSessionMessages', 'get')
      .mockReturnValue([
        {
          id: 'unique-message-id-1',
          author: {id: 'y9d7f8pgn'},
          text: 'User message',
          type: 'text',
        },
        {
          id: 'unique-message-id-2',
          author: {id: 'h3o3lc5xj'},
          text: 'Assistant message',
          type: 'text',
        },
        {
          id: 'unique-message-id-3',
          author: {id: 'system'},
          text: 'System message',
          type: 'text',
        },
      ]);

    const {getByText} = render(<ChatScreen />, {
      withNavigation: true,
    });

    expect(getByText('User message')).toBeTruthy();
    expect(getByText('Assistant message')).toBeTruthy();
    expect(getByText('System message')).toBeTruthy();
  });

  it('stops ongoing completion when stop button is pressed', async () => {
    modelStore.context = new llamaRN.LlamaContext({
      contextId: 1,
      gpu: false,
      reasonNoGPU: '',
      model: {},
    });
    if (modelStore.context) {
      modelStore.context.completion = jest
        .fn()
        .mockReturnValue(new Promise(() => {})); // Never resolves
    }

    const {getByPlaceholderText, getByTestId} = render(<ChatScreen />, {
      withNavigation: true,
    });
    const input = getByPlaceholderText(l10n.en.typeYourMessage);

    await act(async () => {
      fireEvent.changeText(input, 'Hello, AI!');
    });

    const sendButton = getByTestId('send-button');
    fireEvent.press(sendButton);

    const stopButton = getByTestId('stop-button');
    fireEvent.press(stopButton);

    expect(modelStore.context?.stopCompletion).toHaveBeenCalled();
  });
});
