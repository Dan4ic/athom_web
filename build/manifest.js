'use strict'
const path = require('path')
const fs = require('fs')

module.exports = {
    BIN_BLOCK_NAME : 0,
    BIN_BLOCK_ENTRY : 1,
    BIN_BLOCK_SUBSCRIPTION : 2,
    check(manifest){
       //todo application name max 64
       //todo file name max 64
       //todo MAX_TASK_NAME_LEN 16
    },
    make(app){
        const app_path  = path.resolve(__dirname, '../src/applications/', app);

        let manifest    = require(path.resolve(app_path, "manifest.json"));

        if(fs.existsSync(path.resolve(app_path, "favicon.png"))) {
            manifest.favicon    = 'data:image/png;base64,'
                + new Buffer(fs.readFileSync(path.resolve(app_path, "favicon.png"))).toString('base64');
        } else if(fs.existsSync(path.resolve(app_path, "favicon.svg"))) {
            manifest.favicon    = 'data:image/svg+xml;utf8,'
                + fs.readFileSync(path.resolve(app_path, "favicon.svg"));
        }

        if(app in global.components){
            for(let cname in manifest.components){
                if(cname in global.components[app])
                    manifest.components[cname].source =
                        process.env.NODE_ENV === 'production'
                            ? global.components[app][cname].bundle_dist
                            : global.components[app][cname].bundle;
            }
        }

        return manifest;
    },
    binary(manifest){
        //No script side
        if(!('scripts' in manifest))
            return Buffer.from([]);

        //Application name
        let result  = [];
        result.push(Buffer.from(new Uint32Array([this.BIN_BLOCK_NAME, manifest.name.length]).buffer));
        result.push(Buffer.from(manifest.name, 'UTF-8'));

        if(!('entry' in manifest.scripts))
            throw new Error(`The ${manifest.name} application do not have required block [entry] im manifest`);

        if(!('modules' in manifest.scripts))
            throw new Error(`The ${manifest.name} application do not have required block [modules] in manifest`);

        if(!(manifest.scripts.entry in manifest.scripts.modules))
            throw new Error(`The ${manifest.name} application has entry [${manifest.scripts.entry}] but do not have module for it`);

        result.push(Buffer.from(new Uint32Array([this.BIN_BLOCK_ENTRY, manifest.scripts.entry.length]).buffer));
        result.push(Buffer.from(manifest.scripts.entry, 'UTF-8'));

        if('subscriptions' in manifest.scripts)
            manifest.scripts.subscriptions.map((item)=>{
                result.push(Buffer.from(new Uint32Array([this.BIN_BLOCK_SUBSCRIPTION, item.length]).buffer));
                result.push(Buffer.from(item, 'UTF-8'));
            });

        return Buffer.concat(result);
    }
}