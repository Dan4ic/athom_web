'use strict'
const path = require('path')
const fs = require('fs')

module.exports = {
    BIN_BLOCK_NAME : 0,
    BIN_BLOCK_ENTRY : 1,
    BIN_BLOCK_SUBSCRIPTION : 2,
    BIN_BLOCK_STORAGE_VERSION : 10,
    BIN_BLOCK_STORAGE_MIGRATION : 11,
    BIN_BLOCK_STORAGE_TYPE_INT : 12,
    BIN_BLOCK_STORAGE_TYPE_DOUBLE : 13,
    BIN_BLOCK_STORAGE_TYPE_OBJECT : 14,
    check(manifest){
        //todo file name max 64
        //todo MAX_TASK_NAME_LEN 16
        if(!('name' in manifest))
            throw new Error(`Unknown application name`);

        if(manifest.name.length > 64)
            throw new Error(`Application name is too long ${manifest.name} max 64 chars`);

        if('scripts' in manifest){
            if(!('entry' in manifest.scripts))
                throw new Error(`The ${manifest.name} application do not have required block [entry] im manifest`);

            if(!('modules' in manifest.scripts))
                throw new Error(`The ${manifest.name} application do not have required block [modules] in manifest`);

            if(!(manifest.scripts.entry in manifest.scripts.modules))
                throw new Error(`The ${manifest.name} application has entry [${manifest.scripts.entry}] but do not have module for it`);
        }

        if('storage' in manifest) {
            if(!('version' in manifest.storage))
                throw new Error(`Storage of ${manifest.name} do not have required field "version"`);
            if(!('migration' in manifest.storage))
                throw new Error(`Storage of ${manifest.name} do not have required field "migration"`);
            if(!('scripts' in manifest) || !('modules' in manifest.scripts) || !(manifest.storage.migration in manifest.scripts.modules))
                throw new Error(`The ${manifest.name} application has migration [${manifest.storage.migration}] but do not have module for it`);
            if(!('objects' in manifest.storage))
                throw new Error(`Storage of ${manifest.name} do not have required block "objects"`);
            for(let object_name in manifest.storage.objects) {
                if(!('struct' in manifest.storage.objects[object_name]))
                    throw new Error(`The ${manifest.name} application has error in storage structure [storage/objects/${object_name}/struct}]`);
            }
        }
    },
    make(app){
        const app_path  = path.resolve(__dirname, '../src/applications/', app);

        let manifest    = require(path.resolve(app_path, "manifest.json"));

        this.check(manifest);

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
        this.check(manifest);

        let result  = [];

        //No script side
        if(!('scripts' in manifest))
            return Buffer.from([]);

        let appendName = (name) => {
            result.push(Buffer.from(new Uint32Array([name.length]).buffer));
            result.push(Buffer.from(name, 'UTF-8'));
        }

        //Application name
        result.push(Buffer.from(new Uint32Array([this.BIN_BLOCK_NAME]).buffer));
        appendName(manifest.name);

        //Entry name
        result.push(Buffer.from(new Uint32Array([this.BIN_BLOCK_ENTRY]).buffer));
        appendName(manifest.scripts.entry);

        //Subscriptions
        if('subscriptions' in manifest.scripts)
            manifest.scripts.subscriptions.map((item)=>{
                result.push(Buffer.from(new Uint32Array([this.BIN_BLOCK_SUBSCRIPTION]).buffer));
                appendName(item);
            });

        //Storage
        if('storage' in manifest){
            //Version
            result.push(Buffer.from(new Uint32Array([this.BIN_BLOCK_STORAGE_VERSION, manifest.storage.version]).buffer));
            //Migration
            result.push(Buffer.from(new Uint32Array([this.BIN_BLOCK_STORAGE_MIGRATION]).buffer));
            appendName(manifest.storage.migration);
            //Objects
            let expander = (node, level) => {
                let level_prefix = level * 2048;
                for(let field in node) {
                    if(node[field] === "double") {
                        result.push(Buffer.from(new Uint32Array([level_prefix + this.BIN_BLOCK_STORAGE_TYPE_DOUBLE]).buffer));
                        appendName(field);
                    } else if(node[field] === "int") {
                        result.push(Buffer.from(new Uint32Array([level_prefix + this.BIN_BLOCK_STORAGE_TYPE_INT]).buffer));
                        appendName(field);
                    } else if(typeof node[field] === 'object'){
                        result.push(Buffer.from(new Uint32Array([level_prefix + this.BIN_BLOCK_STORAGE_TYPE_OBJECT]).buffer));
                        appendName(field);
                        expander(node[field]);
                    }
                }
            };
            for(let object_name in manifest.storage.objects)
                expander(manifest.storage.objects[object_name].struct);
        }
        return Buffer.concat(result);
    }
}