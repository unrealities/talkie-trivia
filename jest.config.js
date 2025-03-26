module.exports = {
    preset: "jest-expo",
    globals: {
        "process.env": {
            EXPO_OS: "test",
        },
        TEST_ENV: true,
    },
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native/src)|expo(nent)?|@expo(nent)?/.|@expo-modules/.|react-navigation|@react-navigation/.|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|victory-native|victory|react-native-reanimated)/',
        "node_modules/@babel/runtime",
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    setupFiles: ["./jestSetup.js"],
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};
