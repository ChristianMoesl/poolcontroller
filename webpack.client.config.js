const debug = process.env.NODE_ENV === 'development';
const path = require('path');
/* eslint-disable */
const webpack = require('webpack');
/* eslint-enable */

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    context: path.join(__dirname, './src/client'),
    devtool: debug ? 'inline-sourcemap' : false,
    entry: debug ? ['webpack-hot-middleware/client', './Client.tsx'] : './Client.tsx',
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loaders: debug ? ['react-hot', 'awesome-typescript-loader'] : ['awesome-typescript-loader'],
            },
        ],
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'Client.bundle.js',
    },
    plugins: debug ? [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ] : [
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};
