var path = require('path');
var webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var buildResolver = require('haste-map-webpack-resolver');

var currentDir = path.resolve(__dirname, '.');

module.exports = {
    context: currentDir,
    entry: './entry-point.js',
    output: {
        path: './dist',
        filename: 'entry-point.bundle.js',
        library: 'entry-point',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: 'sourcemap',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['babel-preset-es2015']
                        },
                    }
                ]
            }
        ],
    },
    resolve: {
        plugins: [buildResolver(path.resolve(__dirname, '.'))],
    },
    plugins: [
        new webpack.BannerPlugin(
            {
                banner: 'require("source-map-support").install();',
                raw: true,
                entryOnly: false,
            }
        ),
        new ProgressBarPlugin(),
    ],
};