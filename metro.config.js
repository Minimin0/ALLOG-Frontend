const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// mobile/ 은 별도의 독립 RN 프로젝트(HW, 자체 package.json)라
// Metro가 이 안까지 스캔/워치하지 않도록 제외 — 안 그러면 불필요한
// 파일 스캔으로 번들링이 느려지거나 이름 충돌이 날 수 있다.
config.resolver.blockList = /\/mobile\/.*/;

// .svg를 React 컴포넌트로 import (react-native-svg-transformer)
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = withNativeWind(config, { input: './global.css' });
