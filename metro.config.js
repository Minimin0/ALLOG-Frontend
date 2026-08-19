const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// firebase 10.x의 `firebase/auth` export map에는 react-native 조건이 없어서, package exports가
// 켜진 Expo SDK 54 Metro는 브라우저 빌드를 고른다. 그러면 RN용 auth 컴포넌트가 등록되지 않아
// initializeAuth가 "Component auth has not been registered yet"으로 죽는다.
// 내부 @firebase/auth에는 react-native 조건이 있으므로, 조건만 추가해 RN 빌드로 resolve 시킨다.
// (package exports 자체를 끄면 다른 의존성 resolve까지 바뀌므로 조건 추가로 최소화)
config.resolver.unstable_conditionNames = ['react-native', 'require', 'import'];

// .svg를 React 컴포넌트로 import (react-native-svg-transformer)
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = withNativeWind(config, { input: './global.css' });
