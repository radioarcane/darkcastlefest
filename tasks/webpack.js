/*
   Compiles JavaScript (with WebPack 4) located in the 'src/js' folder and moves the transpiled
   output to the public/assets/js folder.

   Uses babel-loader to convert ES6+ to ES5 where needed based on the targeted browserlist
   found in package.json.

   Checkout Webpack documentation on how to customize the bundle process.
*/

const path = require('path');
const webpack = require('webpack');
const colors = require('colors/safe');
const devMode = process.env.NODE_ENV !== 'production';

const distFolder = 'public/js';

const config = {
   context: path.resolve(__dirname, '../src'),
   stats: {
      children: false,
   },
   entry: {
      main: [
         './js/main.js',
         //'webpack/hot/dev-server',
         //'webpack-hot-middleware/client',
      ],
   },
   mode: devMode ? 'development' : 'production',
   output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, `../${ distFolder }/`),
      publicPath: path.resolve(__dirname, `../${ distFolder }/`),
   },
   devtool: devMode ? 'inline-source-map' : false,
   plugins: [
      new webpack.HotModuleReplacementPlugin(),
   ],
   resolve: {
      extensions: ['.js'],
      modules: ['node_modules'],
   },
   module: {
      rules:[{
         test: /\.(js|jsx)$/,
         exclude: /node_modules/,
         use: {
            loader: "babel-loader"
         }
      }]
   }
};

function scripts() {
   return new Promise(resolve => webpack(config, (err, stats) => {
        if (err) {
           console.log(colors.red('Webpack'), colors.red(err));
        }

        console.log(colors.green(stats.toString({ /* stats options */ })));

        resolve();
    }));
}

module.exports = { config, scripts };
