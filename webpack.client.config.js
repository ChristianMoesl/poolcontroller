const isDevelopment = process.env.NODE_ENV === 'development';
const path = require('path');
const webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: ['.ts', '.js', '.scss', '.css', '.html']
    },
    context: path.join(__dirname, './src/client'),
    devtool: isDevelopment ? 'inline-sourcemap' : false,
    entry: isDevelopment ? ['webpack-hot-middleware/client', './main.ts'] : './main.ts',
    module: {
        loaders: [
            {
                test: /\.html$/,
                loaders: ['html-loader'],
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'],
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
            },
        ],
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'Client.bundle.js',
    },
    plugins: isDevelopment ? [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ] : [
//        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};
