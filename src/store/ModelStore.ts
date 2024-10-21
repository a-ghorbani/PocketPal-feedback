import {AppState, AppStateStatus} from 'react-native';

import _ from 'lodash';
import 'react-native-get-random-values'; // Polyfill for uuid
import {v4 as uuidv4} from 'uuid';
import RNFS from 'react-native-fs';
import {makePersistable} from 'mobx-persist-store';
import {computed, makeAutoObservable, ObservableMap, runInAction} from 'mobx';
import {CompletionParams, LlamaContext, initLlama} from 'llama.rn';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {bytesToGB, hasEnoughSpace} from '../utils';
import {defaultModels, MODEL_LIST_VERSION} from './defaultModels';

import {chatTemplates} from '../utils/chat';
import {defaultCompletionParams} from '../utils/chat';
import {ChatTemplateConfig, Model} from '../utils/types';

class ModelStore {
  models: Model[] = [];
  version: number | undefined = undefined; // Persisted version

  appState: AppStateStatus = AppState.currentState;
  useAutoRelease: boolean = true;
  isContextLoading: boolean = false;
  loadingModel: Model | undefined = undefined;
  n_context: number = 1024;
  n_gpu_layers: number = 50;

  activeModelId: string | undefined = undefined;

  context: LlamaContext | undefined = undefined;
  downloadJobs = new ObservableMap(); //new Map();
  useMetal = false; //Platform.OS === 'ios';

  lastUsedModelId: string | undefined = undefined;

  MIN_CONTEXT_SIZE = 200;

  constructor() {
    makeAutoObservable(this, {activeModel: computed});
    makePersistable(this, {
      name: 'ModelStore',
      properties: [
        'models',
        'version',
        'useAutoRelease',
        'n_gpu_layers',
        'useMetal',
        'n_context',
      ],
      storage: AsyncStorage,
    }).then(() => {
      this.initializeStore();
    });

    this.setupAppStateListener();
  }

  initializeStore = async () => {
    const storedVersion = this.version || 0;

    if (storedVersion < MODEL_LIST_VERSION) {
      this.mergeModelLists();
      runInAction(() => {
        this.version = MODEL_LIST_VERSION;
      });
    } else {
      await this.initializeDownloadStatus();
      this.removeInvalidLocalModels();
    }
  };

  mergeModelLists = () => {
    const mergedModels = [...this.models]; // Start with persisted models

    defaultModels.forEach(defaultModel => {
      const existingModelIndex = mergedModels.findIndex(
        m => m.id === defaultModel.id,
      );
      // console.log('existingModelIndex: ', existingModelIndex);

      if (existingModelIndex !== -1) {
        // Merge existing model with new defaults
        mergedModels[existingModelIndex] = {
          ...defaultModel, // Defaults take precedence (for new fields or updates)
          ...mergedModels[existingModelIndex], // User changes override defaults
          chatTemplate:
            mergedModels[existingModelIndex].chatTemplate ||
            defaultModel.chatTemplate,
          completionSettings:
            mergedModels[existingModelIndex].completionSettings ||
            defaultModel.completionSettings,
        };
      } else {
        // Add new model if it doesn't exist
        mergedModels.push(defaultModel);
      }
    });

    runInAction(() => {
      this.models = mergedModels;
    });

    this.initializeDownloadStatus();
  };

  setupAppStateListener = () => {
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (this.useAutoRelease) {
        await this.reinitializeContext();
      }
    } else if (
      this.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      if (this.useAutoRelease) {
        await this.releaseContext();
      }
    }

    runInAction(() => {
      this.appState = nextAppState;
    });
  };

  reinitializeContext = async () => {
    if (this.activeModelId) {
      const model = this.models.find(m => m.id === this.activeModelId);
      if (model) {
        await this.initContext(model);
      }
    }
  };

  setNGPULayers = (n_gpu_layers: number) => {
    runInAction(() => {
      this.n_gpu_layers = n_gpu_layers;
    });
  };

  setNContext = (n_context: number) => {
    runInAction(() => {
      this.n_context = n_context;
    });
  };

  getModelFullPath(model: Model): string {
    if (model.isLocal) {
      if (!model.fullPath) {
        throw new Error('Full path is undefined for local model');
      }
      return model.fullPath;
    }
    if (!model.filename) {
      throw new Error('Model filename is undefined');
    }
    return `${RNFS.DocumentDirectoryPath}/${model.filename}`;
  }

  async checkFileExists(model: Model) {
    const exists = await RNFS.exists(this.getModelFullPath(model));
    runInAction(() => {
      model.isDownloaded = exists;
    });
  }

  refreshDownloadStatuses = async () => {
    this.models.forEach(model => {
      this.checkFileExists(model);
    });
  };

  initializeDownloadStatus = async () => {
    await this.refreshDownloadStatuses();
  };

  removeInvalidLocalModels = () => {
    runInAction(() => {
      this.models = this.models.filter(
        model => !model.isLocal || model.isDownloaded,
      );
    });
  };

  checkSpaceAndDownload = async (modelId: string) => {
    const model = this.models.find(m => m.id === modelId);
    if (!model || model.isLocal || !model.downloadUrl) {
      return;
    }

    const isEnoughSpace = await hasEnoughSpace(model);

    if (isEnoughSpace) {
      this.downloadModel(model);
    } else {
      console.error('Not enough storage space to download the model.');
    }
  };

  downloadModel = async (model: Model) => {
    if (model.isLocal) {
      return;
    } // Skip downloading for local models

    const downloadDest = this.getModelFullPath(model);
    console.log('downloading: downloadDest: ', downloadDest);

    let lastBytesWritten = 0;
    let lastUpdateTime = Date.now();

    const throttledProgress = _.throttle(data => {
      if (!this.downloadJobs.has(model.id)) {
        return;
      } // Ensure the model is still being downloaded
      const newProgress = (data.bytesWritten / data.contentLength) * 100; // Update progress

      // Calculate download speed
      const currentTime = Date.now();
      const timeDiff = (currentTime - lastUpdateTime) / 1000; // Convert to seconds
      const bytesDiff = data.bytesWritten - lastBytesWritten;
      const speedMBps = (bytesDiff / timeDiff / (1024 * 1024)).toFixed(2);

      runInAction(() => {
        model.progress = newProgress;
        model.downloadSpeed = `${bytesToGB(
          data.bytesWritten,
        )}  (${speedMBps} MB/s)`;
      });

      lastBytesWritten = data.bytesWritten;
      lastUpdateTime = currentTime;
    }, 500); // Throttle updates to 500ms

    const options = {
      fromUrl: model.downloadUrl,
      toFile: downloadDest,
      begin: () => {
        runInAction(() => {
          model.progress = 0; // reset progress at the start
        });
      },
      progress: throttledProgress,
    };

    try {
      const ret = RNFS.downloadFile(options);
      runInAction(() => {
        // This is in runInAction so that mobx can track changes.
        this.downloadJobs.set(model.id, ret);
      });

      const result = await ret.promise;
      if (result.statusCode === 200) {
        runInAction(() => {
          model.progress = 100; // Ensure progress is set to 100 upon completion
          this.refreshDownloadStatuses();
        });
      }
    } catch (err: any) {
      if (err.message !== 'Download has been aborted') {
        console.error('Failed to download:', err);
      } else {
        console.log('Download aborted');
      }
    } finally {
      runInAction(() => {
        this.downloadJobs.delete(model.id);
      });
    }
  };

  cancelDownload = async (modelId: string) => {
    const job = this.downloadJobs.get(modelId);
    const model = this.models.find(m => m.id === modelId);
    console.log('cancelling job: ', job);
    if (job) {
      RNFS.stopDownload(job.jobId);
      runInAction(() => {
        this.downloadJobs.delete(modelId);
      });
    }
    console.log('cancelling model: ', model);
    if (model) {
      const downloadDest = this.getModelFullPath(model);
      try {
        // Ensure the destination file is deleted, this is specifically important for android
        await RNFS.unlink(downloadDest);
        console.log('Destination file deleted successfully');
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          // Ignore error if file does not exist
          console.error('Failed to delete destination file:', err);
        }
      }

      runInAction(() => {
        model.isDownloaded = false;
        model.progress = 0;
      });
    }
    this.refreshDownloadStatuses();
  };

  get isDownloading() {
    return (modelId: string) => {
      return this.downloadJobs.has(modelId);
    };
  }

  deleteModel = async (modelName: string) => {
    const modelIndex = this.models.findIndex(m => m.name === modelName);
    if (modelIndex === -1) {
      return;
    }
    const model = this.models[modelIndex];

    if (model.isLocal) {
      runInAction(() => {
        this.models.splice(modelIndex, 1);
        if (this.activeModelId === model.id) {
          this.releaseContext();
        }
      });
      // Delete the file from internal storage
      try {
        await RNFS.unlink(this.getModelFullPath(model));
      } catch (err) {
        console.error('Failed to delete local model file:', err);
      }
    } else {
      const filePath = this.getModelFullPath(model);
      console.log('deleting: ', filePath);

      try {
        if (filePath) {
          await RNFS.unlink(filePath);
          runInAction(() => {
            model.progress = 0;
            if (this.activeModelId === model.id) {
              this.releaseContext();
            }
          });
          console.log('models: ', this.models);
        } else {
          console.error("Failed to delete, file doesn't exist: ", filePath);
        }
        this.refreshDownloadStatuses();
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  getDownloadProgress = (modelId: string) => {
    const model = this.models.find(m => m.id === modelId);
    return model ? model.progress / 100 : 0; // Normalize progress to 0-1 for display
  };

  initContext = async (model: Model) => {
    await this.releaseContext();
    const filePath = this.getModelFullPath(model);
    if (!filePath) {
      throw new Error('Model path is undefined');
    }
    runInAction(() => {
      this.isContextLoading = true;
      this.loadingModel = model;
    });
    try {
      const ctx = await initLlama({
        model: filePath,
        use_mlock: true,
        n_ctx: this.n_context,
        n_gpu_layers: this.useMetal ? this.n_gpu_layers : 0, // Set as needed, 0 for no GPU // TODO ggml-metal.metal
      });
      console.log('ctx: ', ctx);
      runInAction(() => {
        this.context = ctx;
        this.setActiveModel(model.id);
      });
      return ctx;
    } finally {
      runInAction(() => {
        this.isContextLoading = false;
        this.loadingModel = undefined;
        this.lastUsedModelId = model.id;
      });
    }
  };

  releaseContext = async () => {
    console.log('attempt to release');
    if (!this.context) {
      return Promise.resolve('No context to release');
    }
    await this.context.release();
    console.log('released');
    runInAction(() => {
      this.context = undefined;
      //this.activeModelId = undefined;
    });
    return 'Context released successfully';
  };

  manualReleaseContext = async () => {
    await this.releaseContext();
    runInAction(() => {
      this.activeModelId = undefined;
    });
  };

  get activeModel(): Model | undefined {
    return this.models.find(model => model.id === this.activeModelId);
  }

  get lastUsedModel(): Model | undefined {
    return this.lastUsedModelId
      ? this.models.find(m => m.id === this.lastUsedModelId && m.isDownloaded)
      : undefined;
  }

  setActiveModel(modelId: string) {
    this.activeModelId = modelId;
  }

  addLocalModel = async (localFilePath: string) => {
    const filename = localFilePath.split('/').pop(); // Extract filename from path
    if (!filename) {
      throw new Error('Invalid local file path');
    }

    const defaultChatTemplate = chatTemplates.chatML;

    const model: Model = {
      id: uuidv4(), // Generate a unique ID
      name: filename,
      size: '', // Placeholder for UI to ignore
      params: '', // Placeholder for UI to ignore
      isDownloaded: true,
      downloadUrl: '',
      hfUrl: '',
      progress: 0,
      filename,
      fullPath: localFilePath,
      isLocal: true,
      defaultChatTemplate: {...defaultChatTemplate},
      chatTemplate: defaultChatTemplate,
      defaultCompletionSettings: {...defaultCompletionParams},
      completionSettings: {...defaultCompletionParams},
    };

    runInAction(() => {
      this.models.push(model);
      this.refreshDownloadStatuses();
    });
  };

  updateModelChatTemplate = (
    modelId: string,
    newConfig: ChatTemplateConfig,
  ) => {
    const model = this.models.find(m => m.id === modelId);
    if (model) {
      runInAction(() => {
        model.chatTemplate = newConfig;
      });
    }
  };

  updateCompletionSettings = (
    modelId: string,
    newSettings: CompletionParams,
  ) => {
    const model = this.models.find(m => m.id === modelId);
    if (model) {
      runInAction(() => {
        model.completionSettings = newSettings;
      });
    }
  };

  resetModels = () => {
    const localModels = this.models.filter(model => model.isLocal);

    runInAction(() => {
      this.models = [];
      this.version = 0;
      this.mergeModelLists();

      // Add back the local models
      this.models = [...this.models, ...localModels];
    });
  };

  resetModelChatTemplate = (modelId: string) => {
    const model = this.models.find(m => m.id === modelId);
    if (model) {
      runInAction(() => {
        model.chatTemplate = {...model.defaultChatTemplate};
      });
    }
  };

  resetCompletionSettings = (modelId: string) => {
    const model = this.models.find(m => m.id === modelId);
    if (model) {
      runInAction(() => {
        model.completionSettings = {...model.defaultCompletionSettings};
      });
    }
  };

  updateUseMetal = (useMetal: boolean) => {
    runInAction(() => {
      this.useMetal = useMetal;
    });
  };

  updateUseAutoRelease = (useAutoRelease: boolean) => {
    runInAction(() => {
      this.useAutoRelease = useAutoRelease;
    });
  };

  get chatTitle() {
    if (this.isContextLoading) {
      return 'Loading model ...';
    }
    return (
      (this.context?.model as any)?.metadata?.['general.name'] ?? 'Chat Page'
    );
  }
}

export const modelStore = new ModelStore();
