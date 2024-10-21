export default {
  pick: jest.fn(() =>
    Promise.resolve({
      uri: 'dummy-uri',
      type: 'dummy-type',
      name: 'dummy-name',
      size: 1234,
    }),
  ),
  pickMultiple: jest.fn(() =>
    Promise.resolve([
      {
        uri: 'dummy-uri',
        type: 'dummy-type',
        name: 'dummy-name',
        size: 1234,
      },
    ]),
  ),
  types: {
    allFiles: 'public.all-files',
    images: 'public.images',
  },
};

//export default DocumentPicker;
