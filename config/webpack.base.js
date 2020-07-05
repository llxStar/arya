const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { resolve, baseStyleLoader } = require('./util');

module.exports = {
  mode: 'none',
  // context: resolve('src'), // 下面配置的基本路径，不指定
  entry: resolve('src', 'main.js'),
  resolve: {
    extensions: ['.js', '.vue', '.scss', '.css'],
    alias: {
      '@': resolve('src'), // src目录
      '@js': resolve('src', 'common', 'js'), // 公用js目录
      '@css': resolve('src', 'common', 'css'), // 公用css目录
      '@img': resolve('src', 'assets', 'images'), // 公用的icon，小图片之类
      '@font': resolve('src', 'assets', 'fonts'), // 字体文件
      '@util': resolve('src', 'common', 'js'), // util包位置，以后可能会有公用css，先放common目录下，mixins之类的后面考虑下有没有更好的实现
      '@comp': resolve('src', 'components'), // 公用组件，img loading toast confirm location-dialog之类的
    },
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'src/[name].[contenthash:8].[ext]', // 资源名称后面需要动态修改支持精准控制缓存
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: baseStyleLoader,
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.s[ca]ss$/,
        use: baseStyleLoader.concat({
          loader: 'sass-loader',
          options: {
            prependData: '@import "@css/base.scss";'
          },
        }),
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
      chunksSortMode: (chunk1, chunk2) => {
        const priority = []; // 设置高优先级entry文件注入顺序，从前往后
        if (priority.length === 0) return 0;
        const c1 = priority.indexOf(chunk1.names[0]); // 貌似names只有一个值
        const c2 = priority.indexOf(chunk2.names[0]);
        if (c1 === -1 && c2 === -1) return 0;
        else if (c1 === -1) return 1;
        else if (c2 === -1) return -1;
        else if (c1 > c2) return 1;
        else if (c1 < c2) return -1;
        else return 0
      }
    }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([{
      from: resolve('public'), // 都用path模块处理，避免不同系统/和\路径的区别
      to: resolve('dist'),
    }]),
    new webpack.ProvidePlugin({
      util: [resolve('src', 'common', 'js', 'util')],
    }),
  ]
};
