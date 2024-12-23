module.exports = {
    preset: "jest-expo",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|victory-native|victory|@babel/runtime/helpers/(?!(extends|typeof|jsx)))",
        "/Users/tomszymanski/Documents/Code/talkie-trivia/node_modules/react-native/Libraries/vendor/emitter/EventEmitter.js"
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testEnvironment: "jsdom",
    setupFiles: ["./jestSetup.js"],
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"]
};
