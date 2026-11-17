module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  clearMocks: true,
  collectCoverageFrom: ["controllers/**/*.js", "middleware/**/*.js"],
  coveragePathIgnorePatterns: ["/node_modules/"]
};
