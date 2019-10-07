const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // добавили плагин
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use:  [
                    (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
                    'css-loader', 
                    'postcss-loader'
                ] // добавили минификацию CSS
            },
            {
                test: /images[\\\/].+\.(gif|png|jpe?g|svg)$/i,
                use: {
                  loader: 'file-loader',
                  options: {
                    name: 'images/[name][hash].[ext]'
                  }
                },
              }, {
                test: /fonts[\\\/].+\.(eot|svg|ttf|woff|woff2)$/,
                use: {
                  loader: 'file-loader',
                  options: {
                    name: 'fonts/[name][hash].[ext]'
                  }
                },
              }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new MiniCssExtractPlugin({ // 
            filename: 'style.[contenthash].css',
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                    preset: ['default'],
            },
            canPrint: true
       }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new WebpackMd5Hash()
    ]
};