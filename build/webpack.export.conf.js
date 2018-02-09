'use strict'
const config = require('../config')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
      app: './src/export.js'
  },
  devtool: false,
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath
  },
  node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
  },
  plugins: [
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'platform.hexp',
      template: 'index.html',
      inject: false,
      //Injection source code to HTML
      app_js: function(){
        return fs.readFileSync(path.join(__dirname, '../dist/static/js/app.js'), 'utf8');
      },
      app_css: function(){
        return fs.readFileSync(path.join(__dirname, '../dist/static/css/app.css'), 'utf8');
      },
      vendor_js: function(){
        return fs.readFileSync(path.join(__dirname, '../dist/static/js/vendor.js'), 'utf8');
      },
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        minifyCSS: true,
        minifyJS: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),

    new CompressionWebpackPlugin({
        asset: 'platform.gz',
        algorithm: 'gzip',
        test: new RegExp(
            '\\.(hexp)$'
        ),
        threshold: 10240,
        minRatio: 0.8
    })


  ]
}