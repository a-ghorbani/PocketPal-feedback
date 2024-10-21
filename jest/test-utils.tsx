import React from 'react';

import {PaperProvider} from 'react-native-paper';
import {render} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {themeFixtures} from './fixtures/theme';

import {UserContext} from '../src/utils';
import type {Theme} from '../src/utils/types';
import {user as userFixture} from './fixtures';

type CustomRenderOptions = {
  theme?: Theme;
  user?: any;
  withNavigation?: boolean;
  withSafeArea?: boolean;
};

const customRender = (
  ui: React.ReactElement,
  {
    theme = themeFixtures.lightTheme,
    user = userFixture,
    withNavigation = false,
    withSafeArea = false,
    ...renderOptions
  }: CustomRenderOptions = {},
) => {
  const Wrapper = ({children}: {children: React.ReactNode}) => {
    const content = withNavigation ? (
      <NavigationContainer>{children}</NavigationContainer>
    ) : (
      children
    );

    const wrappedWithSafeArea = withSafeArea ? (
      <SafeAreaProvider>{content}</SafeAreaProvider>
    ) : (
      content
    );

    return (
      <PaperProvider theme={theme}>
        <UserContext.Provider value={user}>
          {wrappedWithSafeArea}
        </UserContext.Provider>
      </PaperProvider>
    );
  };

  return render(ui, {wrapper: Wrapper, ...renderOptions});
};

// Re-export everything
export * from '@testing-library/react-native';
export {customRender as render};
