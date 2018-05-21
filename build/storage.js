'use strict'
module.exports = {
    BIN_BLOCK_STORAGE_OBJECT : 10,
    BIN_BLOCK_STORAGE_VERSION : 11,
    BIN_BLOCK_STORAGE_MIGRATION : 12,
    BIN_BLOCK_STORAGE_TYPE_INT : 13,
    BIN_BLOCK_STORAGE_TYPE_DOUBLE : 14,
    BIN_BLOCK_STORAGE_TYPE_OBJECT : 15,

    makeBinaryField(type, name){
        return Buffer.concat([
            Buffer.from(new Uint32Array([type]).buffer),
            Buffer.from(name, 'UTF-8'),
            Buffer.from(new Uint8Array([0]).buffer)
        ]);
    },

    makeBinaryHeader(object_manifest){
        //Encoding object structure
        let encode_struct = (node, level) => {
            let level_prefix = level * 2048;
            let result  = [];
            for(let field in node) {
                if(node[field] === "double") {
                    result.push(this.makeBinaryField(level_prefix + this.BIN_BLOCK_STORAGE_TYPE_DOUBLE, field));
                } else if(node[field] === "int") {
                    result.push(this.makeBinaryField(level_prefix + this.BIN_BLOCK_STORAGE_TYPE_INT, field));
                } else if(typeof node[field] === 'object'){
                    result.push(this.makeBinaryField(level_prefix + this.BIN_BLOCK_STORAGE_TYPE_OBJECT, field));
                    result.push(encode_struct(node[field], level + 1));
                } else
                    throw new Error(`Storage of ${manifest.name} have error type "${node[field]}"`);
            }
            return Buffer.concat(result);
        };

        let header = Buffer.concat([
            //Version
            this.makeBinaryField(this.BIN_BLOCK_STORAGE_VERSION, 'version' in object_manifest ? "" + object_manifest.version : "0"),
            //Migration
            this.makeBinaryField(this.BIN_BLOCK_STORAGE_MIGRATION, 'migration' in object_manifest ? object_manifest.migration : ""),
            //Struct
            encode_struct(object_manifest.struct, 0)
        ]);

        return Buffer.concat([
            Buffer.from(new Uint32Array([header.length]).buffer),
            header
        ]);

    }
}