const { getDefaultConfig } = require("@expo/metro-config");
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push("cjs");
defaultConfig.resolver.sourceExts.push("mjs", "cjs", "js", "ts", "tsx");

module.exports = defaultConfig;
