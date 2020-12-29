module.exports = {
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/pages/(.*)$": "<rootDir>/pages/$1",
  },
  testPathIgnorePatterns: ["/pages/", "/node_modules/"],
  verbose: true,
};
