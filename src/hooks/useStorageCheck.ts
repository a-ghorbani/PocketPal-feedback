import {useEffect, useState} from 'react';

import DeviceInfo from 'react-native-device-info';

import {hasEnoughSpace} from '../utils';

import {Model} from '../utils/types';

export const useStorageCheck = (model: Model) => {
  const [storageStatus, setStorageStatus] = useState({
    isOk: true,
    message: '',
  });

  useEffect(() => {
    const abortController = new AbortController();

    const checkStorage = async () => {
      try {
        if (model.isDownloaded || model.isLocal) {
          return;
        }

        const isEnoughSpace = await hasEnoughSpace(model);
        if (abortController.signal.aborted) {
          return;
        }

        if (!isEnoughSpace) {
          const freeDisk = await DeviceInfo.getFreeDiskStorage('important');
          if (abortController.signal.aborted) {
            return;
          }

          setStorageStatus({
            isOk: false,
            message: `Storage low! Model ${model.size} GB > ${(
              freeDisk /
              1000 ** 3
            ).toFixed(2)} GB free`,
          });
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Storage check failed:', error);
          setStorageStatus({isOk: false, message: 'Failed to check storage'});
        }
      }
    };

    checkStorage();
    const intervalId = setInterval(checkStorage, 30000);

    return () => {
      abortController.abort();
      clearInterval(intervalId);
    };
  }, [model]);

  return storageStatus;
};
