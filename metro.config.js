const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("cjs");
config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    "jsx",
    "js",
    "ts",
    "tsx",
    "cjs",
]

config.resolver.nodeModulesPaths = [
    ...config.resolver.nodeModulesPaths,
    `${__dirname}/node_modules`,
];

module.exports = config;
