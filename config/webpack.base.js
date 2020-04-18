const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { resolve } = require('./util');

module.exports = {
  mode: 'none',
  // context: resolve('src'), // 下面配置的基本路径，不指定
  entry: resolve('src', 'main.js'),
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
	  new VueLoaderPlugin(),
	  new CopyWebpackPlugin([{
		  from: resolve('public'), // 都用path模块处理，避免不同系统/和\路径的区别
		  to: resolve('dist'),
	  }]),
  ]
};
