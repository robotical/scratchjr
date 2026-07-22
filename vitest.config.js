const path = require('path');

module.exports = {
    assetsInclude: ['**/*.hex'],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    test: {
        environment: 'node',
        include: ['tests/**/*.test.js'],
        fileParallelism: false
    }
};
