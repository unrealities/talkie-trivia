const babelJest = require("babel-jest").default;

module.exports = babelJest.createTransformer({
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-proposal-class-properties",
  ],
  babelrc: false,
  configFile: false,
});
