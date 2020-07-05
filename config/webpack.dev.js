process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const { resolve } = require('./util');
const baseConfig = require('./webpack.base');
const merge = require('webpack-merge');

module.exports = merge({
  devServer: {
    port: 9000,
    compress: true,
    hot: true,
    open: true,
    clientLogLevel: 'silent',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [resolve('src')],
        options: {
          cacheDirectory: true, // 设置了这个缓存后，动态改变.browserslistrc不会生效，生产环境禁用
        }
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      }
    }),
  ]
}, baseConfig);
