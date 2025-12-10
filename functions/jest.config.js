module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/*.test.ts"],
    moduleFileExtensions: ["ts", "js", "json", "node"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    moduleNameMapper: {
        "^uuid$": require.resolve("uuid"),
    },
    transform: {
        "^.+\\.ts$": ["ts-jest", {
            isolatedModules: true,
            tsconfig: "tsconfig.json"
        }]
    }
};
