/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }],
    },
    setupFilesAfterEnv: [],
    moduleNameMapper: {
        '^@types/(.*)$': '<rootDir>/src/types/$1',
        '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
        '^@routes/(.*)$': '<rootDir>/src/routes/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@scripts/(.*)$': '<rootDir>/src/scripts/$1'
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
};


