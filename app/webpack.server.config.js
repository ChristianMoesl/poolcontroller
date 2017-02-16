const debug = process.env.NODE_ENV === 'development';
const path = require('path');
const fs = require('fs');

if (debug) {
    fs.createReadStream('webpack.client.config.js').pipe(fs.createWriteStream('./src/server/webpack.config.js'));
}

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach((mod) => {
        nodeModules[mod] = `commonjs ${mod}`;
    });

module.exports = {
    context: path.join(__dirname, '/src/server'),
    entry: './Server.js',
    target: 'node',
    devtool: 'sourcemap',
    externals: nodeModules,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['latest-minimal'],
                    plugins: ['transform-strict-mode'],
                },
            },
        ],
    },
    output: {
        path: path.join(__dirname),
        filename: 'Server.js',
    },
    node: {
        __dirname: false,
        __filename: false,
    },
};
