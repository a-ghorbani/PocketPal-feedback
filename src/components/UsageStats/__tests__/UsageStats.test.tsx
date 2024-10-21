import React from 'react';

import DeviceInfo from 'react-native-device-info';
import {render, fireEvent, act} from '@testing-library/react-native';

import {UsageStats} from '../UsageStats';

describe('UsageStats Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays memory stats correctly', async () => {
    const totalMemory = 4 * 1000 * 1000 * 1000;
    const usedMemory = 2 * 1000 * 1000 * 1000;

    (DeviceInfo.getTotalMemory as jest.Mock).mockResolvedValueOnce(totalMemory);
    (DeviceInfo.getUsedMemory as jest.Mock).mockResolvedValueOnce(usedMemory);

    const {getByText, queryByText, getByTestId} = render(
      <UsageStats width={100} height={50} />,
    );

    // Tooltip should not be visible
    expect(queryByText('Memory Usage')).toBeNull();

    // Wait for memory stats to be fetched and graph to be updated
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    // Press the graph to display the tooltip
    fireEvent.press(getByTestId('memory-usage-touchable'));

    // Check if the tooltip shows the correct values
    expect(getByText('Used: 2 GB')).toBeTruthy();
    expect(getByText('Total: 4 GB')).toBeTruthy();
    expect(getByText('Usage: 50.0%')).toBeTruthy();
  });

  it('renders the memory usage graph as an SVG', async () => {
    const totalMemory = 4 * 1000 * 1000 * 1000;
    const usedMemory = 2 * 1000 * 1000 * 1000;

    (DeviceInfo.getTotalMemory as jest.Mock).mockResolvedValueOnce(totalMemory);
    (DeviceInfo.getUsedMemory as jest.Mock).mockResolvedValueOnce(usedMemory);

    const {getByTestId} = render(<UsageStats width={100} height={50} />);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    // Check if the SVG is rendered
    const svgElement = getByTestId('memory-usage-svg');
    expect(svgElement).toBeTruthy();
  });

  it('toggles the tooltip on press', async () => {
    const totalMemory = 4 * 1000 * 1000 * 1000;
    const usedMemory = 2 * 1000 * 1000 * 1000;

    (DeviceInfo.getTotalMemory as jest.Mock).mockResolvedValueOnce(totalMemory);
    (DeviceInfo.getUsedMemory as jest.Mock).mockResolvedValueOnce(usedMemory);

    const {queryByTestId, getByTestId} = render(
      <UsageStats width={100} height={50} />,
    );

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    // Press the graph to display the tooltip
    fireEvent.press(getByTestId('memory-usage-touchable'));

    expect(getByTestId('memory-usage-tooltip')).toBeTruthy();

    // hide the tooltip
    fireEvent.press(getByTestId('memory-usage-touchable'));

    expect(queryByTestId('memory-usage-tooltip')).toBeNull();
  });
});
