const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);
config.transformer.babelTransformerPath =
  require.resolve("react-native-svg-transformer/expo");
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg",
);
config.resolver.sourceExts.push("svg");
// Keep shared, framework-agnostic mock data identical to the web source.
config.watchFolders = [path.resolve(__dirname, "../src/data")];

module.exports = config;
