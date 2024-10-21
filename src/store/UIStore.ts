import {Appearance} from 'react-native';

import {makePersistable} from 'mobx-persist-store';
import {makeAutoObservable, runInAction} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UIStore {
  pageStates = {
    modelsScreen: {
      filters: ['grouped'],
      expandedGroups: {},
    },
  };

  // This is a flag to auto-navigate to the chat page after loading a model
  autoNavigatetoChat = true;

  //colorScheme = useColorScheme();
  colorScheme: 'light' | 'dark' = Appearance.getColorScheme() ?? 'light';

  displayMemUsage = false;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'UIStore',
      properties: [
        'pageStates',
        'colorScheme',
        'autoNavigatetoChat',
        'displayMemUsage',
      ], // Properties to persist
      storage: AsyncStorage,
    });
  }

  setValue<T extends keyof typeof this.pageStates>(
    page: T,
    key: keyof (typeof this.pageStates)[T],
    value: any,
  ) {
    runInAction(() => {
      if (this.pageStates[page]) {
        this.pageStates[page][key] = value;
      } else {
        console.error(`Page '${page}' does not exist in pageStates`);
      }
    });
  }

  setColorScheme(colorScheme: 'light' | 'dark') {
    runInAction(() => {
      this.colorScheme = colorScheme;
    });
  }

  setAutoNavigateToChat(value: boolean) {
    runInAction(() => {
      this.autoNavigatetoChat = value;
    });
  }

  setDisplayMemUsage(value: boolean) {
    runInAction(() => {
      this.displayMemUsage = value;
    });
  }
}

export const uiStore = new UIStore();
