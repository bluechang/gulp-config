

const path 					= 	require('path');
const webpack 				= 	require('webpack');
const ExtractTextPlugin 	= 	require('extract-text-webpack-plugin');
const HtmlPlugin 			= 	require('html-webpack-plugin');
const ProvidePlugin 		= 	webpack.ProvidePlugin;
const CommonsChunkPlugin 	= 	webpack.optimize.CommonsChunkPlugin;
const UglifyJsPlugin 		= 	webpack.optimize.UglifyJsPlugin;
const isDev					=   process.env.NODE_ENV.trim() === 'dev';

module.exports = {
	entry: {
		index: ['./src/js/index.js'],
		libraries: ['jquery']
	},
	output: {
		path: path.join(__dirname, 'dist'),
		// specifies the public URL address of the output files
		publicPath: '/dist/',
		filename: 'js/[name].js',
		chunkFilename: 'js/[name].chunk.js' 
	},
	module: {
		loaders: [{
			test: /\.less$/i,
			loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!less')  
		},{
			test: /\.(jpe?g|png|gif|svg)$/i,
	        loader: 'url?limit=10000&name=images/[hash:8].[name].[ext]'
		}]
	},
	plugins: [ 
		// what will is exposed as a global variable instead of key in every module
		new ProvidePlugin({
			$: 'jquery'
		}),
		new CommonsChunkPlugin({
			name: 'libraries', 
			filaname: 'js/[name].js', 
			minChunks: Infinity
		}),
		new ExtractTextPlugin('css/[name].css'), 
		new HtmlPlugin({
			filename: 'index.html', 
			template: 'src/index.html', 
			inject: true,
			hash: false,
			minify: {
				removeComments: true
			}
		}),
		// compress js file
		/*new UglifyJsPlugin({ 
			compress:{warnings: false}, 
			output: {comments: false},
			except: ['$super', '$', 'exports', 'require'] 
		})*/
	]
}



// judge the environment
if(isDev){
	module.exports.devtool = '#inline-source-map';
	module.exports.devServer = {
		contentBase: './dist/',
		inline: true,
		quiet: true,
		color: true,
		historyApiFallback: true
	};
}else{
	delete module.exports.devtool; 
}


