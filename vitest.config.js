const path = require('path');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    test: {
        environment: 'node',
        include: ['tests/**/*.test.js']
    }
});
