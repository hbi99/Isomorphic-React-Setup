'use strict';

var debug            = require('debug')('app');
var webpack          = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig    = require('./webpack.config.dev');
var livereload       = require('livereload');
var fs               = require('fs');

// Run the webpack dev server
var webpackServer = new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  contentBase: 'http://localhost:4000',
  noInfo: true,
  hot: true,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
}).listen(4001, 'localhost', function (err, result) {
  if (err) console.log(err);
  else  debug('Webpack server listening on port 4001');
});

// Watch public dir with livereload
var lr = livereload.createServer();
lr.watch(__dirname + '/../public');
