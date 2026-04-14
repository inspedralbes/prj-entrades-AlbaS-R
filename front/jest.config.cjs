module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
 },
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '#imports': '<rootDir>/tests/mocks/nuxt-imports.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@pinia|pinia|@vue|vue-router|perfect-debounce|@nuxt)/)',
  ],
};
