module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  },
  testMatch: ["**/*.spec.+(ts|tsx)"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/$1"
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/db/migration/"
  ],
  setupFilesAfterEnv: [
    `./jest.setup.js`
  ]
}