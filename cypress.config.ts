import { defineConfig } from 'cypress';
import webpackPreprocessor from '@cypress/webpack-preprocessor';
import path from 'path';

export default defineConfig({
  env: {
    apiUrl: 'http://localhost:8081',
    CYPRESS_USERNAME: 'test2@test.fr',
    CYPRESS_PASSWORD: 'testtest',
  },
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      const options = {
        ...webpackPreprocessor.defaultOptions,
        webpackOptions: {
          ...webpackPreprocessor.defaultOptions.webpackOptions,
          resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {
              '@src': path.resolve(__dirname, 'src'),
            },
            fallback: {
              path: require.resolve('path-browserify'),
              os: require.resolve('os-browserify'),
            },
          },
        },
      };

      on('file:preprocessor', webpackPreprocessor(options));

      return config;
    },
  },
});
