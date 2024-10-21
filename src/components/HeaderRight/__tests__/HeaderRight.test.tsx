import React from 'react';

import {render, fireEvent} from '../../../../jest/test-utils';

import {HeaderRight} from '../HeaderRight';

import {chatSessionStore, uiStore} from '../../../store';

jest.mock('../../UsageStats', () => ({
  UsageStats: jest.fn(() => {
    const {View} = require('react-native');
    return <View testID="usage-stats" />;
  }),
}));

describe('HeaderRight', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without UsageStats when displayMemUsage is false', () => {
    uiStore.displayMemUsage = false;
    const {queryByTestId} = render(<HeaderRight />);
    expect(queryByTestId('usage-stats')).toBeNull();
    expect(queryByTestId('reset-button')).toBeTruthy();
  });

  it('renders UsageStats when displayMemUsage is true', () => {
    uiStore.displayMemUsage = true;
    const {queryByTestId} = render(<HeaderRight />);
    expect(queryByTestId('usage-stats')).toBeTruthy();
    expect(queryByTestId('reset-button')).toBeTruthy();
  });

  it('calls resetActiveSession when reset button is pressed', () => {
    const {queryByTestId} = render(<HeaderRight />);
    const resetButton = queryByTestId('reset-button');
    expect(resetButton).toBeTruthy();
    if (resetButton) {
      fireEvent.press(resetButton);
    }
    expect(chatSessionStore.resetActiveSession).toHaveBeenCalled();
  });
});
