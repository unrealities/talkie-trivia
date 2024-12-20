module.exports = {
    preset: "jest-expo",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
        // Exclude all node_modules except some specific ones
        "node_modules/(?!jest-expo|expo|react-native|@react-native)",
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testEnvironment: "jsdom",
};
