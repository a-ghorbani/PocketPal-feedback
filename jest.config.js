module.exports = {
  preset: 'react-native',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/index.{ts,tsx}',
    '!**/styles.{ts,tsx}',
    '!**/types.{ts,tsx}',
    '!**/*.d.ts',
    '!**/ImageView.android.ts',
    '!**/ImageView.ios.ts',
    '!**/ImageView.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./jest/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(@flyerhq|@react-native|react-native|uuid|react-native-reanimated|react-native-gesture-handler|react-native-vector-icons|react-native-image-viewing|react-native-parsed-text|@react-navigation/.*|@react-native-masked-view/masked-view|react-native-linear-gradient|react-native-picker-select|react-native-paper)/)',
  ],
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleNameMapper: {
    '@react-native-async-storage/async-storage':
      '<rootDir>/__mocks__/external/@react-native-async-storage/async-storage.js',
    'llama.rn': '<rootDir>/__mocks__/external/llama.rn.ts',
    'react-dom': '<rootDir>/__mocks__/external/react-dom.js',
    'react-native-device-info':
      '<rootDir>/__mocks__/external/react-native-device-info.js',
    'react-native-document-picker':
      '<rootDir>/__mocks__/external/react-native-document-picker.js',
    'react-native-fs': '<rootDir>/__mocks__/external/react-native-fs.js',
  },
};
