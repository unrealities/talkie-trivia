module.exports = {
    preset: "jest-expo",
    globals: {
        "process.env": {
            EXPO_OS: "test",
        },
    },
    testEnvironment: "jsdom",
    transform: {
        "^.+\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
        "/node_modules/(?!react-native|react-native-reanimated|@react-native-community/masked-view|expo(nent)?|@expo(nent)?/.|react-navigation|@react-navigation/.|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|victory-native|victory)/",
        "node_modules/@babel/runtime",
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    setupFiles: ["./jestSetup.js"],
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};
