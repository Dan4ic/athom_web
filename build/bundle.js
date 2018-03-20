'use strict'
const path = require('path')
const fs = require('fs')

module.exports = {
  appendFile(bundle, file){
    fs.appendFileSync(bundle, 'test');
    //todo
    //Int32Array
  },
  make(appname){
    let bundle = `${appname}/${appname}.smt`;
    let bundle_path = path.resolve(__dirname, bundle);
    fs.writeFileSync(bundle_path, "");
    return bundle;
  }
}