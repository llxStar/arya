const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const resolve = (...args) => path.join(__dirname, '..', ...args);
const baseStyleLoader = [MiniCssExtractPlugin.loader,'css-loader', 'postcss-loader']

module.exports = {
  mode: 'none',
  // context: resolve('src'), // 下面配置的基本路径，不指定
  entry: resolve('src', 'main.js'),
  output: {
    path: resolve('dist'),
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: baseStyleLoader,
      },
      {
        test: /\.scss$/,
        use: baseStyleLoader.concat('sass-loader'),
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve('public', 'index.html'),
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      chunksSortMode: 'auto'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    }),
  ]
};
