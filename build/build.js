'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const BundleApp = require('./bundle');
const fs = require('fs')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) {
      spinner.stop()
      throw err
    }
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    } else {
        let bundles = [];
        let apps_path = path.resolve(__dirname, '../src/applications/');
        fs.readdirSync(apps_path).forEach(dir => {
            if (fs.lstatSync(path.resolve(apps_path, dir)).isDirectory()) {
                bundles.push(BundleApp.make(dir));
            }
        });
        console.info(chalk.yellow('  Built applications bundles:\n'))
        for(let i=0; i<bundles.length; i++) {
            console.info(chalk.yellow(`  ${i+1}. ${bundles[i]};`))
        }
    }
  })
})
