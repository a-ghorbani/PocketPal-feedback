const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

//const localPackagePaths = ['localpath/code/llama.rn'];

const config = {
  resolver: {
    //nodeModulesPaths: [...localPackagePaths], // update to resolver
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  //watchFolders: [...localPackagePaths],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
