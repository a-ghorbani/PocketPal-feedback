import {act, renderHook} from '@testing-library/react-hooks';

import {largeDiskModel, basicModel} from '../../../jest/fixtures/models';

import {useStorageCheck} from '../useStorageCheck';

describe('useStorageCheck', () => {
  it('returns storage OK status when there is enough space', async () => {
    const {result} = renderHook(() => useStorageCheck(basicModel));

    expect(result.current).toEqual({
      isOk: true,
      message: '',
    });
  });

  it('returns storage low message when there is not enough space', async () => {
    const {result, waitForNextUpdate} = renderHook(() =>
      useStorageCheck(largeDiskModel),
    );

    await waitForNextUpdate();

    expect(result.current).toEqual(
      expect.objectContaining({
        isOk: false,
        message: expect.stringContaining('Storage low!'),
      }),
    );
  });

  it('does not update state when unmounted (cleanup test)', async () => {
    const {result, unmount, waitForNextUpdate} = renderHook(() =>
      useStorageCheck(largeDiskModel),
    );

    unmount();

    // wait for the state to update (which should not happen after unmount)
    await act(async () => {
      try {
        await waitForNextUpdate();
      } catch (error) {
        // Ignoring timeout
      }
    });

    expect(result.current).toEqual({
      isOk: true,
      message: '',
    });
  });
});
