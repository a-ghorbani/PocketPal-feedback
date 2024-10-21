import {CompletionParams} from 'llama.rn';

import {deviceInfo} from './device-info';

import {Model} from '../../src/utils/types';

export const mockDefaultCompletionParams: CompletionParams = {
  prompt: '',
  n_predict: 400,
  temperature: 0.7,
  top_k: 40,
  top_p: 0.95,
  tfs_z: 1.0,
  typical_p: 1.0,
  penalty_last_n: 64,
  penalty_repeat: 1.0,
  penalty_freq: 0.5,
  penalty_present: 0.4,
  mirostat: 0,
  mirostat_tau: 5,
  mirostat_eta: 0.1,
  penalize_nl: false,
  seed: 0,
  n_probs: 0,
  stop: ['</s>'],
};

export const mockCompletionParams: CompletionParams = {
  ...mockDefaultCompletionParams,
  n_predict: 500,
  temperature: 0.01,
  stop: ['<stop1>', '<stop2>'],
};

export const mockDefaultChatTemplate = {
  addGenerationPrompt: true,
  name: 'default chat template name',
  bosToken: '<|default_bos|>',
  eosToken: '<|default_eos|>',
  chatTemplate: 'default chat template',
  systemPrompt: 'default system prompt',
};
export const mockChatTemplate = {
  addGenerationPrompt: true,
  name: 'chat template name',
  bosToken: '<|test_bos|>',
  eosToken: '<|test_eos|>',
  chatTemplate: 'test chat template',
  systemPrompt: 'test system prompt',
};

export const mockBasicModel: Model = {
  id: 'model-1',
  name: 'Test Model 1',
  type: 'Test Model Type',
  size: '2',
  params: '2',
  isDownloaded: false,
  downloadUrl: 'https://huggingface.co/test/test-model-1',
  hfUrl: 'https://huggingface.co/test/test-model-1',
  progress: 0,
  filename: 'test-model-1.gguf',
  isLocal: false,
  defaultChatTemplate: mockDefaultChatTemplate,
  chatTemplate: mockChatTemplate,
  defaultCompletionSettings: mockDefaultCompletionParams,
  completionSettings: mockCompletionParams,
};

// Factory function for creating custom models
export const createModel = (overrides = {}) => ({
  ...mockBasicModel,
  ...overrides,
});

export const basicModel = createModel({
  id: 'model-1',
  name: 'basic model',
});

export const downloadedModel = createModel({
  id: 'model-2',
  name: 'downloaded model',
  isDownloaded: true,
});

export const downloadingModel = createModel({
  id: 'model-3',
  name: 'downloading model',
  isDownloaded: false,
  progress: 45,
});

export const largeDiskModel = createModel({
  id: 'model-4',
  name: 'large model',
  isDownloaded: false,
  size: ((deviceInfo.freeDiskStorage * 1.1) / 1000 ** 3).toString(), // 10% more than free disk storage
});

export const largeMemoryModel = createModel({
  id: 'model-5',
  name: 'large model for memory',
  isDownloaded: true,
  size: ((deviceInfo.totalMemory * 1.1) / 1000 ** 3).toString(), // 10% more than total memory
});

export const localModel = createModel({
  id: 'model-6',
  name: 'local model',
  isLocal: true,
  type: 'Local',
});

export const modelsList: Model[] = [
  basicModel,
  downloadedModel,
  downloadingModel,
  largeDiskModel,
  largeMemoryModel,
  localModel,
];
