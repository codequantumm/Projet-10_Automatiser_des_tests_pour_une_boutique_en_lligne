import { defineConfig } from 'cypress';
import webpackPreprocessor from '@cypress/webpack-preprocessor';
import path from 'path';

export default defineConfig({
  e2e: {
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
          },
        },
      };

      on('file:preprocessor', webpackPreprocessor(options));

      return config;
    },
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
