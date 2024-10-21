import React from 'react';
import {Alert} from 'react-native';

import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import {fireEvent, render, waitFor, act} from '../../../../jest/test-utils';

import {ModelsScreen} from '../ModelsScreen';

import {modelStore, uiStore} from '../../../store';

jest.useFakeTimers();

describe('ModelsScreen', () => {
  beforeEach(() => {
    //(useTheme as jest.Mock).mockReturnValue(mockTheme);
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const {getByText, getByTestId} = render(<ModelsScreen />, {
      withNavigation: true,
    });
    expect(getByText('Downloaded')).toBeTruthy();
    expect(getByText('Grouped')).toBeTruthy();
    expect(getByTestId('add-local-model-fab')).toBeTruthy();
    expect(getByTestId('reset-models-fab')).toBeTruthy();
  });

  it('refreshes models on pull-to-refresh', async () => {
    const {getByTestId} = render(<ModelsScreen />, {
      withNavigation: true,
    });

    const flatList = getByTestId('flat-list');
    const refreshControl = flatList.props.refreshControl;
    await act(async () => {
      refreshControl.props.onRefresh();
    });

    expect(modelStore.refreshDownloadStatuses).toHaveBeenCalled();
  });

  it('adds a local model when the plus FAB is pressed', async () => {
    (DocumentPicker.pick as jest.Mock).mockResolvedValue([
      {
        uri: '/mock/file/path',
        name: 'mockModelFile.bin',
      },
    ]);

    const {getByTestId} = render(<ModelsScreen />, {
      withNavigation: true,
    });
    const addLocalModelButton = getByTestId('add-local-model-fab');

    await act(async () => {
      fireEvent.press(addLocalModelButton);
    });

    await waitFor(() => {
      expect(DocumentPicker.pick).toHaveBeenCalled();
      expect(RNFS.copyFile).toHaveBeenCalledWith(
        '/mock/file/path',
        '/path/to/documents/models/mockModelFile.bin',
      );
      expect(modelStore.addLocalModel).toHaveBeenCalledWith(
        '/path/to/documents/models/mockModelFile.bin',
      );
    });
  });

  it('shows a confirmation alert if file already exists and replaces it', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);
    (DocumentPicker.pick as jest.Mock).mockResolvedValue([
      {
        uri: '/mock/file/path',
        name: 'mockModelFile.bin',
      },
    ]);

    jest.spyOn(Alert, 'alert').mockImplementation((_, __, buttons) => {
      buttons![0].onPress!();
    });

    const {getByTestId} = render(<ModelsScreen />, {
      withNavigation: true,
    });
    const addLocalModelButton = getByTestId('add-local-model-fab');

    await act(async () => {
      fireEvent.press(addLocalModelButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
      expect(RNFS.unlink).toHaveBeenCalledWith(
        '/path/to/documents/models/mockModelFile.bin',
      );
      expect(RNFS.copyFile).toHaveBeenCalled();
      expect(modelStore.addLocalModel).toHaveBeenCalled();
    });
  });

  it('does not replace or copy the file when user cancels the action', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);
    (DocumentPicker.pick as jest.Mock).mockResolvedValue([
      {
        uri: '/mock/file/path',
        name: 'mockModelFile.bin',
      },
    ]);

    jest.spyOn(Alert, 'alert').mockImplementation((_, __, buttons) => {
      // pressing "Cancel"
      buttons![2].onPress!();
    });

    const {getByTestId} = render(<ModelsScreen />, {
      withNavigation: true,
    });
    const addLocalModelButton = getByTestId('add-local-model-fab');

    await act(async () => {
      fireEvent.press(addLocalModelButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
      expect(RNFS.unlink).not.toHaveBeenCalled(); // File should not be unlinked (deleted)
      expect(RNFS.copyFile).not.toHaveBeenCalled(); // File should not be copied
      expect(modelStore.addLocalModel).not.toHaveBeenCalled(); // Model should not be added
    });
  });

  it('keeps both files when user chooses to keep both', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValueOnce(true); // File already exists
    (DocumentPicker.pick as jest.Mock).mockResolvedValue([
      {
        uri: '/mock/file/path',
        name: 'mockModelFile.bin',
      },
    ]);

    jest.spyOn(Alert, 'alert').mockImplementation((_, __, buttons) => {
      // pressing "Keep Both"
      buttons![1].onPress!();
    });

    let counter = 1;
    (RNFS.exists as jest.Mock).mockImplementation(async path => {
      if (path.includes(`mockModelFile_${counter}.bin`)) {
        return false; // Ensure new file doesn't exist
      }
      return true; // Original file exists
    });

    const {getByTestId} = render(<ModelsScreen />, {
      withNavigation: true,
    });
    const addLocalModelButton = getByTestId('add-local-model-fab');

    await act(async () => {
      fireEvent.press(addLocalModelButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
      expect(RNFS.unlink).not.toHaveBeenCalled(); // Original file should not be deleted
      expect(RNFS.copyFile).toHaveBeenCalledWith(
        '/mock/file/path',
        `/path/to/documents/models/mockModelFile_${counter}.bin`,
      );
      expect(modelStore.addLocalModel).toHaveBeenCalledWith(
        `/path/to/documents/models/mockModelFile_${counter}.bin`,
      );
    });
  });

  it('filters models correctly when segmented buttons are toggled', async () => {
    const {getByText} = render(<ModelsScreen />, {
      withNavigation: true,
    });
    const downloadedFilter = getByText('Downloaded');

    await act(async () => {
      fireEvent.press(downloadedFilter);
    });

    expect(uiStore.setValue).toHaveBeenCalledWith(
      'modelsScreen',
      'filters',
      expect.any(Array),
    );
  });

  it('opens reset dialog and resets models on confirm', async () => {
    const {getByTestId} = render(<ModelsScreen />, {
      withNavigation: true,
    });

    const resetFab = getByTestId('reset-models-fab');
    await act(async () => {
      fireEvent.press(resetFab);
    });

    const proceedButton = getByTestId('proceed-reset-button');
    await act(async () => {
      fireEvent.press(proceedButton);
    });

    expect(modelStore.resetModels).toHaveBeenCalled();
  });

  it('hides reset dialog on cancel', async () => {
    const {getByTestId, queryByTestId} = render(<ModelsScreen />, {
      withNavigation: true,
    });

    const resetFab = getByTestId('reset-models-fab');
    await act(async () => {
      fireEvent.press(resetFab);
    });

    const cancelButton = getByTestId('cancel-reset-button');
    await act(async () => {
      fireEvent.press(cancelButton);
    });

    await waitFor(() => {
      expect(queryByTestId('reset-dialog')).toBeNull();
    });
  });
});
