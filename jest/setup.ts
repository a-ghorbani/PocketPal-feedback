import {mockModelStore} from '../__mocks__/stores/modelStore';
import {mockUiStore} from '../__mocks__/stores/uiStore';
import {mockChatSessionStore} from '../__mocks__/stores/chatSessionStore';

import 'react-native-gesture-handler/jestSetup';

import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';
jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native-safe-area-context', () => {
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  return {
    ...jest.requireActual('react-native-safe-area-context'),
    SafeAreaProvider: jest.fn(({children}) => children),
    SafeAreaConsumer: jest.fn(({children}) => children(inset)),
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({x: 0, y: 0, width: 390, height: 844})),
  };
});

jest.mock('../src/store', () => ({
  modelStore: mockModelStore,
  uiStore: mockUiStore,
  chatSessionStore: mockChatSessionStore,
}));

jest.mock('../src/hooks/useTheme', () => {
  const {themeFixtures} = require('./fixtures/theme');
  return {
    useTheme: jest.fn().mockReturnValue(themeFixtures.lightTheme),
  };
});
