import {modelsList} from '../../jest/fixtures/models';

export const mockModelStore = {
  models: modelsList,
  n_context: 1024,
  MIN_CONTEXT_SIZE: 200,
  useAutoRelease: true,
  useMetal: false,
  n_gpu_layers: 50,
  activeModel: null,
  setNContext: jest.fn(),
  updateUseAutoRelease: jest.fn(),
  updateUseMetal: jest.fn(),
  setNGPULayers: jest.fn(),
  refreshDownloadStatuses: jest.fn(),
  addLocalModel: jest.fn(),
  resetModels: jest.fn(),
  //initContext: jest.fn().mockResolvedValue(undefined),
  initContext: jest.fn().mockResolvedValue(Promise.resolve()),
  checkSpaceAndDownload: jest.fn(),
  getDownloadProgress: jest.fn(),
  manualReleaseContext: jest.fn(),
};
Object.defineProperty(mockModelStore, 'lastUsedModel', {
  get: jest.fn(() => undefined),
  configurable: true,
});
Object.defineProperty(mockModelStore, 'isDownloading', {
  get: jest.fn(() => () => false),
  configurable: true,
});
