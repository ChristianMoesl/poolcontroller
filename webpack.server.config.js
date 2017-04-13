const path = require('path');
const fs = require('fs');
/* eslint-disable */
const webpack = require('webpack');
/* eslint-enable */

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach((mod) => {
        nodeModules[mod] = `commonjs ${mod}`;
    });

module.exports = function config(env) {
    if (env.development) {
        fs.writeFileSync('./src/server/webpack.client.config.js', fs.readFileSync('./webpack.client.config.js'));
    }

    return {
        context: path.join(__dirname, '/src/server'),
        entry: './Server.js',
        target: 'node',
        devtool: 'inline-sourcemap',
        externals: nodeModules,
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader?retainLines=true',
                    query: {
                        presets: ['latest-minimal', 'babel-preset-power-assert', 'flow'],
                        plugins: ['transform-strict-mode'],
                    },
                },
            ],
        },
        output: {
            path: path.join(__dirname),
            filename: 'Server.bundle.js',
        },
        node: {
            __dirname: false,
            __filename: false,
        },
        plugins: env.development ? [
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') }),
            new webpack.NoEmitOnErrorsPlugin(),
        ] : [
            new webpack.NoEmitOnErrorsPlugin(),
        ],
    };
};
