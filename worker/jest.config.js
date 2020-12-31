module.exports = {
  setupFiles: ["dotenv/config"],
  testPathIgnorePatterns: [
    "/__tests__/fixtures/",
    "/__tests__/helpers.js",
    "/node_modules/",
  ],
  verbose: true,
};
