module.exports = {
  globals: {
    "process.env": {
      EXPO_OS: "test",
    },
    __DEV__: true,
    TEST_ENV: true,
  },
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  transformIgnorePatterns: [
    "node_modules/(?!(@react-native-community|react-native-vector-icons)/)",
  ],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
  },

  setupFiles: ["./jestSetup.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};
