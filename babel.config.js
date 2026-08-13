module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    // Reanimated 4는 worklets 플러그인을 쓴다(구 reanimated/plugin 대체). 반드시 마지막.
    plugins: ['react-native-worklets/plugin'],
  };
};
