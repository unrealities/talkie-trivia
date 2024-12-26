module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            "@babel/plugin-transform-modules-commonjs",
            [
                "@babel/plugin-transform-runtime",
                {
                    regenerator: true,
                },
            ],
        ],
        overrides: [
            {
                test: (fileName) => fileName.includes("node_modules"),
                plugins: [
                    "@babel/plugin-transform-modules-commonjs",
                ],
            },
        ],
    };
};
