var path = require('path');
    module.exports = {
        entry: './src/clavish.js',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'main.js'
        },
        module: {
            loaders: [
                { test: path.join(__dirname, 'src'),
                  loader: 'babel-loader',
                  query: {
                    presets: ['es2015']
                  }
                }
            ]
        }
    };
