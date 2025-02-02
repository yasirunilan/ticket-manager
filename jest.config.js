export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/test/**/*.test.js"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
