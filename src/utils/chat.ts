import {applyTemplate, Templates} from 'chat-formatter';
import {ChatMessage, ChatTemplateConfig, MessageType} from './types';
//import {assistant} from '../store/ChatSessionStore';
import {CompletionParams} from 'llama.rn';

export const userId = 'y9d7f8pgn';
export const assistantId = 'h3o3lc5xj';
export const user = {id: userId};
export const assistant = {id: assistantId};

export function convertToChatMessages(
  messages: MessageType.Any[],
): ChatMessage[] {
  return messages
    .filter(message => message.type === 'text' && message.text !== undefined)
    .map(message => {
      return {
        content: (message as MessageType.Text).text!,
        role: message.author.id === assistant.id ? 'assistant' : 'user',
      } as ChatMessage;
    })
    .reverse();
}

export function applyChatTemplate(
  template: ChatTemplateConfig,
  chat: ChatMessage[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  length: number, //TODO: inforce length of formattedChat to fit the context.
): string {
  const formattedChat: string = applyTemplate(chat, {
    customTemplate: template,
    addGenerationPrompt: template.addGenerationPrompt,
  }) as string;

  return formattedChat;
}

export const chatTemplates = {
  danube3: {
    ...Templates.templates.danube2,
    name: 'danube3',
    addGenerationPrompt: true,
    systemPrompt:
      'You are a helpful assistant named H2O Danube3. You are precise, concise, and casual.',
  },
  danube2: {
    ...Templates.templates.danube2,
    name: 'danube2',
    addGenerationPrompt: true,
    systemPrompt:
      'You are a helpful assistant named H2O Danube2. You are precise, concise, and casual.',
  },
  phi3: {
    ...Templates.templates.phi3,
    name: 'phi3',
    addGenerationPrompt: true,
    systemPrompt:
      'You are a helpful conversational chat assistant. You are precise, concise, and casual.',
  },
  gemmaIt: {
    ...Templates.templates.gemmaIt,
    name: 'gemmaIt',
    addGenerationPrompt: true,
    systemPrompt:
      'You are a helpful conversational chat assistant. You are precise, concise, and casual.',
  },
  chatML: {
    ...Templates.templates.chatML,
    name: 'chatML',
    addGenerationPrompt: true,
    systemPrompt:
      'You are a helpful conversational chat assistant. You are precise, concise, and casual.',
  },
  default: {
    ...Templates.templates.default,
    name: 'default',
    addGenerationPrompt: true,
    systemPrompt:
      'You are a helpful conversational chat assistant. You are precise, concise, and casual.',
  },
  llama3: {
    ...Templates.templates.llama3,
    name: 'llama3',
    addGenerationPrompt: true,
    systemPrompt:
      'You are a helpful conversational chat assistant. You are precise, concise, and casual.',
  },
  llama32: {
    ...Templates.templates.llama32,
    name: 'llama32',
    addGenerationPrompt: true,
    systemPrompt: '',
  },
  gemmasutra: {
    ...Templates.templates.gemmasutra,
    name: 'gemmasutra',
    addGenerationPrompt: true,
    systemPrompt:
      'You are a helpful conversational chat assistant. You are precise, concise, and casual.',
  },
  qwen2: {
    ...Templates.templates.qwen2,
    name: 'qwen2',
    addGenerationPrompt: true,
    systemPrompt: 'You are a helpful assistant.',
  },
  qwen25: {
    ...Templates.templates.qwen25,
    name: 'qwen25',
    addGenerationPrompt: true,
    systemPrompt:
      'You are Qwen, created by Alibaba Cloud. You are a helpful assistant.',
  },
};

export const defaultCompletionParams: CompletionParams = {
  prompt: '',
  n_predict: 400,
  temperature: 0.7,
  top_k: 40,
  top_p: 0.95,
  tfs_z: 1.0,
  typical_p: 1.0,
  penalty_last_n: 64,
  penalty_repeat: 1.0,
  penalty_freq: 0.0,
  penalty_present: 0.0,
  mirostat: 0,
  mirostat_tau: 5,
  mirostat_eta: 0.1,
  penalize_nl: false,
  seed: 0,
  n_probs: 0,
  stop: ['</s>'],
  // emit_partial_completion: true, // This is not used in the current version of llama.rn
};
