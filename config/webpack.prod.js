process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { resolve } = require('./util');
const baseConfig = require('./webpack.base');
const merge = require('webpack-merge');

module.exports = merge({
  output: {
    path: resolve('dist'),
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
  },
  optimization: {
    minimize: true, // 告知 webpack 使用 TerserPlugin 压缩 bundle
    minimizer: [
      new TerserWebpackPlugin({
        exclude: /node_modules/,
        include: /\.js$/, // 匹配的是文件
        parallel: true,
        cache: false, // 生产环境不缓存
        extractComments: false, // 不抽离版权信息
      }),
    ],
    splitChunks: {
      // all	把动态和非动态模块同时进行优化打包；所有模块都扔到 vendors.bundle.js 里面。
      // async	把动态模块打包进 vendor，非动态模块保持原样
      // initial	把非动态模块打包进 vendor，动态模块优化打包
      chunks: 'all', // 或者用func动态判断chunk.name !== 'my-excluded-chunk';
      minSize: 30720, // 拆分前的chunk最小30kb，可以适当调整大点，http2下可以更细致点
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: { // 定义的缓存组，关键，上面的配置会被集成到下面的缓存组里面，
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 优先级比app高，同样满足vendors和app的将会优先打包进这里
        },
        app: {
          minChunks: 10, // 证明这个模块基本被公用，被所有组件引进来，或者根据definedPlugin通过chunks动态判断
          priority: -20,
          reuseExistingChunk: true,  // 重用已存在的缓存
        },
      },
    },
    removeAvailableModules: true, // 子模块移除已在vendor的chunk
    removeEmptyChunks: true, // 移除空chunk
    mergeDuplicateChunks: true, // 合并含有相同模块的chunk
    flagIncludedChunks: true, // 告知webpack，若该chunk的父集被加载，则不必加载子集
    providedExports: true, // Figure out which exports are provided by modules to generate more efficient code.
    usedExports: true, // 跟上面的一样，用来标记导入导出，方便简化代码。Figure out which exports are used by modules to mangle export names, omit unused exports and generate more efficient code.
    concatenateModules: true, // 简化代码，开启这个就不用在plugin里面再调用一次
    sideEffects: true, // 是否开启 无副作用代码检测，开启后根据package.json中的sideEffects来tree shaking副作用代码
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [resolve('src')],
        options: {
          cacheDirectory: false, // 设置了这个缓存后，动态改变.browserslistrc不会生效，生产环境禁用
        }
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      }
    }),
  ]
}, baseConfig);
