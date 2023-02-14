module.exports = function (api) {
  api.cache(false);
  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      ['module:react-native-dotenv', {
        'allowlist': null,
        'allowUndefined': true,
        'blacklist': null,
        'blocklist': null,
        'envName': 'APP_ENV',
        'moduleName': '@env',
        'path': '.env',
        'safe': false,
        'verbose': false,
        'whitelist': null
      }]
    ]
  };
};
