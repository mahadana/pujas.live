module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: ["dotenv/config"],
  testPathIgnorePatterns: [
    "/tests/fixtures/",
    "/tests/helpers\\.js",
    "/node_modules/",
  ],
  verbose: true,
};
