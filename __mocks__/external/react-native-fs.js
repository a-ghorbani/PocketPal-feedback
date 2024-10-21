export default {
  mkdir: jest.fn(),
  unlink: jest.fn(),
  exists: jest.fn(),
  stopDownload: jest.fn(),
  readFile: jest.fn(path => {
    if (path.includes('session-metadata.json')) {
      // Return valid session metadata JSON
      return Promise.resolve(
        JSON.stringify([
          {
            id: '1',
            title: 'Test Session',
            date: '2024-01-01T00:00:00Z',
            messages: [],
          },
        ]),
      );
    }

    // Handle other required file.
    return Promise.resolve('Some default content');
  }),
  writeFile: jest.fn((path, data) => {
    return Promise.resolve();
  }),
  downloadFile: jest.fn(),
  DocumentDirectoryPath: '/path/to/documents',
  copyFile: jest.fn().mockResolvedValue(true),
};
