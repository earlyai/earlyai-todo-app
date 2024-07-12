module.exports = {
  // Basic Environment Setup
  testEnvironment: "node",
  rootDir: "src",

  // Module Resolution
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/$1"
  },

  // Testing Patterns and Coverage
  testRegex: ".*\\.test\\.ts$",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/","/routes/","/db.ts","/app.ts","/models"],
  coverageDirectory: "../coverage",
};