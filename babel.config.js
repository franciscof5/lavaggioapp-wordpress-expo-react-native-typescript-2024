module.exports = function(api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
// module.exports = function(api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//   };
// };
