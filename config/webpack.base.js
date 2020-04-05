const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
  optimization: {
    minimize: true, // 告知 webpack 使用 TerserPlugin 压缩 bundle
    minimizer: [
      new TerserWebpackPlugin({
        exclude: /node_modules/,
        include: /\.js$/, // 匹配的是文件
        parallel: true,
        cache: false, // 生产环境不缓存
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
  },
	resolve: {
		extensions: ['.js', '.vue', '.scss', '.css'],
		alias: {
			'@': resolve('src'), // src目录
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
		    options: {
			    cacheDirectory: true, // 设置了这个缓存后，动态改变.browserslistrc不会生效，生产环境禁用
		    }
	    },
	    {
	    	test: /\.vue$/,
		    use: 'vue-loader'
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
    new OptimizeCssAssetsWebpackPlugin(),
	  new VueLoaderPlugin(),
	  new CopyWebpackPlugin([{
		  from: resolve('public'), // 都用path模块处理，避免不同系统/和\路径的区别
		  to: resolve('dist'),
	  }]),
  ]
};
