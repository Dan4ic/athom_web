'use strict'
const path = require('path')
const fs = require('fs')

module.exports = {
    createBundle(bundle){
        fs.writeFileSync(bundle, "SMTB01");
    },
    appendName(bundle, name){
        if(name.length > 254)
            throw new Error(`Filename is so long "${name}" max length is 254`);
        fs.appendFileSync(bundle, new Buffer([name.length]), "binary");
        fs.appendFileSync(bundle, name);
    },
    appendFile(bundle, file) {

        this.appendName(bundle, path.basename(file));

        let filesize    = fs.statSync(file).size;
        fs.appendFileSync(bundle, Buffer.from(new Int32Array([filesize]).buffer), "binary");

        fs.open(file, 'r', function(status, fd) {
            if (status) {
                console.error(status.message);
                throw new Error(`Can not open ${file}`);
            }

            let buffer = new Buffer(filesize);
            fs.read(fd, buffer, 0, filesize, 0, function(err, num) {
                if(err) {
                    console.error(err.message);
                    throw new Error(`Error of reading file ${file}`);
                }
                fs.appendFileSync(bundle, buffer, "binary");
            });

        });
    },
    make(appname) {
        let bundle = `${appname}/${appname}.smt`;
        let bundle_path = path.resolve(__dirname, '../dist/apps', bundle);
        let app_path = path.resolve(__dirname, `../dist/apps/${appname}/`);

        this.createBundle(bundle_path);

        fs.readdirSync(app_path).forEach(file => {
            if([`${appname}.smt`, 'manifest.json'].indexOf(path.basename(file)) < 0){
                this.appendFile(bundle_path, path.resolve(app_path, file));
            }
        });

        return bundle;
    }
}