export default {
  clearMocks: true,
  coverageProvider: "v8",
  collectCoverageFrom: [
    '<rootDir>/src/modules/**/useCases/**/*UseCase.ts'
  ],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: [
    "text-summary",
    "lcov",
  ],
  preset: "ts-jest",
};
