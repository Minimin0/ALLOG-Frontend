const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// .svg를 React 컴포넌트로 import (react-native-svg-transformer)
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// firebase 10의 패키지 exports에는 react-native 조건이 @firebase/auth에만 있고
// @firebase/app에는 없다. Metro가 exports를 우선하면 app은 웹 빌드로, auth는 RN
// 빌드로 갈려 컴포넌트 레지스트리가 두 개 생기고, initializeAuth가
// "Component auth has not been registered yet"으로 죽는다. 레거시 react-native
// 필드 해석으로 되돌려 두 패키지가 같은 인스턴스를 보게 한다.
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './global.css' });
