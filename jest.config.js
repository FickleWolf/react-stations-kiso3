module.exports = {
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    },
    testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
    roots: ["<rootDir>/src"],
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
    },
};