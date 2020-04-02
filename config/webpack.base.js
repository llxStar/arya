const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const resolve = (...args) => path.join(__dirname, '..', ...args);
const baseStyleLoader = [MiniCssExtractPlugin.loader,'css-loader', 'postcss-loader'];

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
        test: /\.s(?:c|a)ss$/,
        use: baseStyleLoader.concat('sass-loader'),
      },
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
	    	test: /\.js$/,
		    loader: 'babel-loader',
		    exclude: /node_modules/,
		    include: [resolve('src')],
		    // options: {
			  //   cacheDirectory: true, // 设置了这个缓存后，动态改变.browserslistrc不会生效，生产环境禁用
		    // }
	    }
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
    new OptimizeCssAssetsWebpackPlugin()
  ]
};
