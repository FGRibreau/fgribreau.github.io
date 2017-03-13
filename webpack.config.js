const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/script/main.js'
  },
  output: {
    filename: '[name].js',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: true
    })
  ],
  module: {
    loaders: [{
      test: /.js?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015']
      }
    },
    { test: /\.json$/, loader: 'json' },
  ]
  }
};
