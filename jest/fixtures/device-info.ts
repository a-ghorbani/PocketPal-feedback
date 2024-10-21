export const deviceInfo = {
  freeDiskStorage: 8 * 1000 ** 3,
  totalMemory: 4 * 1000 ** 3,
  usedMemory: 2 * 1000 ** 3,
};

export const deviceInfoIPhone = {
  ...deviceInfo,
  manufacturer: 'Apple',
  model: 'iPhone 12',
  systemVersion: '14.5',
};

export const deviceInfoAndroid = {
  ...deviceInfo,
  manufacturer: 'Samsung',
  model: 'Galaxy S21',
  systemVersion: '12',
};
