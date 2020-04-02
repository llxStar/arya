module.exports = api => {
	api.cache(false);
	const presets = [
		['@babel/preset-env', {
				modules: false, // 不转化模块
				useBuiltIns: 'usage',
				corejs: 3, // 需要 @babel/runtime-corejs3 2就对应@babel/runtime-corejs2
			}
		],
	];
	const plugins = [
		['@babel/plugin-transform-runtime', {
				corejs: 3,
			}
		],
		['@babel/plugin-proposal-optional-chaining', { // 支持obj?. // preset-env已经支持该语法，但是设置高版本pc端浏览器后不会转，需要使用插件
				'loose': false
			}
		],
	];
	return {
		presets,
		plugins,
	}
};
