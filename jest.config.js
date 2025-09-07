export default {
  testEnvironment: "node",
  moduleFileExtensions: ["js"],
  transform: { "^.+\\.js$": "babel-jest" },
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/**/*.test.{js,jsx}", "!src/**/index.{js,jsx}"],
  coverageDirectory: "coverage",
};
