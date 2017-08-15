const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const DIST = path.resolve(__dirname, 'dist');

module.exports = {
  devtool: 'source-map', // any "source-map"-like devtool is possible
  entry: path.resolve(__dirname, 'src/app.js'),
  output: {
    path: DIST,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        // Allows root relative paths in SASS
        loader: ExtractTextPlugin.extract(`css!sass`),
        root: path.resolve(__dirname),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('style.css', {
      allChunks: true,
      disable: process.env.NODE_ENV === 'development',
    }),
  ],
};
