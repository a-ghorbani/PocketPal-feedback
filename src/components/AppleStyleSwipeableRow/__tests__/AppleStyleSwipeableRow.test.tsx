import React from 'react';

import {Text} from 'react-native-paper';
import {render, fireEvent} from '@testing-library/react-native';

import {AppleStyleSwipeableRow} from '../AppleStyleSwipeableRow';

jest.mock('react-native-gesture-handler', () => ({
  RectButton: 'RectButton',
  Swipeable: ({children, renderLeftActions}) => (
    <div>
      {renderLeftActions(
        {interpolate: jest.fn().mockReturnValue(0)},
        {interpolate: jest.fn()},
      )}
      {children}
    </div>
  ),
}));

describe('AppleStyleSwipeableRow', () => {
  const mockOnDelete = jest.fn();
  const mockOnSwipeableOpen = jest.fn();
  const mockOnSwipeableClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByText} = render(
      <AppleStyleSwipeableRow onDelete={mockOnDelete}>
        <Text>Child Component</Text>
      </AppleStyleSwipeableRow>,
    );

    expect(getByText('Child Component')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  it('calls onDelete when delete button is pressed', () => {
    const {getByText} = render(
      <AppleStyleSwipeableRow onDelete={mockOnDelete}>
        <Text>Child Component</Text>
      </AppleStyleSwipeableRow>,
    );

    fireEvent.press(getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onSwipeableOpen swiped', () => {
    const {getByText} = render(
      <AppleStyleSwipeableRow
        onDelete={mockOnDelete}
        onSwipeableOpen={mockOnSwipeableOpen}
        onSwipeableClose={mockOnSwipeableClose}>
        <Text>Child Component</Text>
      </AppleStyleSwipeableRow>,
    );

    // Simulate opening the swipeable
    fireEvent(getByText('Child Component'), 'onSwipeableOpen', 'left');
    expect(mockOnSwipeableOpen).toHaveBeenCalledTimes(1);

    // Simulate closing the swipeable
    fireEvent(getByText('Child Component'), 'onSwipeableClose', 'left');
    expect(mockOnSwipeableClose).toHaveBeenCalledTimes(1);
  });
});
