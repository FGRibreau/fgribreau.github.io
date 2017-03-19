const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const DIST = path.resolve(__dirname, 'dist');

module.exports = {
  devtool: "source-map", // any "source-map"-like devtool is possible
  entry: path.resolve(__dirname, "src/app.js"),
  output: {
      path: DIST,
      filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass'),
      }
    ]
  },
  plugins: [new ExtractTextPlugin("style.css", {
    allChunks:true,
    disable: process.env.NODE_ENV === "development"
  })]
};
