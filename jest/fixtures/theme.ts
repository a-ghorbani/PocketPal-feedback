import type {Theme} from '../../src/utils/types';
import {darkTheme, lightTheme} from '../../src/utils/theme';

export const themeFixtures = {
  lightTheme: lightTheme,
  darkTheme: darkTheme,

  // customization for individual tests
  createTheme: (overrides: {colors?: Record<string, string>}): Theme => ({
    ...themeFixtures.lightTheme,
    ...overrides,
    colors: {
      ...themeFixtures.lightTheme.colors,
      ...(overrides.colors || {}),
    },
  }),
};
