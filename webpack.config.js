'use strict';

let path = require('path');
let webpack = require('webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
var _ = require('lodash');

// Disables ES6 template literals from lodash templates: https://github.com/lodash/lodash/issues/399
_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

module.exports = {
  entry: {
    learn: './src/scripts/index.js'
  },
  port: 8080,
  devtool: 'sourcemap',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'app.min.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, './src'),
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.less/,
        loader: 'style!css!less'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file?context=src&name=[path][name].[ext]'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file?name=fonts/[name].[ext]"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file?name=fonts/[name].[ext]"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file?name=fonts/[name].[ext]"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file?name=fonts/[name].[ext]"
      }
    ]
  },
  resolve: {
    alias: {
      styles: path.join(__dirname, '/src/styles/')
    }
  },
  devServer: {
    stats: { colors: true },
    contentBase: './src',
    historyApiFallback: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      "window.jQuery": "jquery"
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      env: process.env.NODE_ENV
    }),
    //new webpack.optimize.UglifyJsPlugin()
  ]
};
