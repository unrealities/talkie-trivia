module.exports = {
    preset: "jest-expo",
    globals: {
        "process.env": {
            EXPO_OS: "test",
        },
    },
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|victory-native|victory|@babel/runtime/helpers/(?!(extends|typeof|jsx))|expo-modules-core|react-native-is-edge-to-edge)",],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testEnvironment: "jsdom", // Or "node" if you don't need DOM
    setupFiles: ["./jestSetup.js"],
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};
