const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: [
		'./src/App.ts'
	],
	output: {
		path: path.resolve(__dirname),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					appendTsSuffixTo: [/\.vue$/]
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			}
		]
	},
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.css'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	},
	plugins: [
		CopyWebpackPlugin([{from: 'node_modules/vis/dist/vis.min.css', to: '../css/vendor/vis/vis.min.css'}])
	]
};

if (process.env.NODE_ENV === 'development') {
	module.exports.entry = (module.exports.entry || []).concat([
		'webpack-dev-server/client?http://localhost:8080',
		'webpack/hot/only-dev-server'
	]);

	module.exports.devServer = {
		contentBase: path.resolve(__dirname, './js'),
			// Path to the js folder in your mindmaps dir (as seen form Nextcloud / webserver)
			publicPath: '/custom_apps/mindmaps/js/',
			proxy: {
			'*': {
				// This is the url where your local Nextcloud instance lives
				target: 'http://localhost',
					secure: false,
					changeOrigin: false
			}
		}
	};
}

if (process.env.NODE_ENV === 'production') {
	// See: http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: false,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	]);
}
