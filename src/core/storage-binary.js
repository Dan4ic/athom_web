'use strict'

const bundle_str = require('../../build/storage');

module.exports = {

    parseBinaryInt8(state){
        let result = new DataView(state.data, state.offset).getInt8(0, true);
        state.offset += 1;
        return result;
    },

    parseBinaryInt32(state){
        let result = new DataView(state.data, state.offset).getInt32(0, true);
        state.offset += 4;
        return result;
    },

    parseBinaryDouble64(state){
        let result = new DataView(state.data, state.offset).getFloat64(0, true);
        state.offset += 8;
        return result;
    },

    parseBinaryString(state){
        let len = this.parseBinaryInt32(state);
        let str = (new TextDecoder("utf-8")).decode(new DataView(state.data, state.offset, len));
        state.offset += len;
        return str;
    },

    parseBinaryField(state){
        let result = {
            prefix :this.parseBinaryInt32(state),
            name : ''
        }
        result.level = Math.floor(result.prefix/2048);
        result.type = result.prefix % 2048;

        let char = new DataView(state.data, state.offset).getUint8();
        while(char){
            result.name += String.fromCharCode(char);
            state.offset++;
            char = new DataView(state.data, state.offset).getUint8();
        }
        state.offset++;
        return result;
    },

    parseBinaryStruct(state, level){
        let result  = [];
        while(state.offset < state.header_size){
            let field = this.parseBinaryField(state);
            switch (field.type){
                case bundle_str.BIN_BLOCK_STORAGE_VERSION : {
                    state.version = field.name;
                    break;
                }
                case bundle_str.BIN_BLOCK_STORAGE_MIGRATION : {
                    state.migration = field.name;
                    break;
                }
                case bundle_str.BIN_BLOCK_STORAGE_TYPE_OBJECT : {
                    result.push({
                        name : field.name,
                        substruct : this.parseBinaryStruct(state, (level ? 0 : level) + 1)
                    });
                    break;
                }
                case bundle_str.BIN_BLOCK_STORAGE_TYPE_INT : {
                    result.push({
                        name : field.name,
                        parser : this.parseBinaryInt32
                    });
                    break;
                }
                case bundle_str.BIN_BLOCK_STORAGE_TYPE_DOUBLE : {
                    result.push({
                        name : field.name,
                        parser : this.parseBinaryDouble64
                    });
                    break;
                }
            }
        }

        return result;
    },

    //Parsing binary object header + body to object
    parseBinaryRow(state){
        let parseSubStruct = function(substruct){
            let result = {};
            for(let field_name in substruct){
                let field = substruct[field_name];
                if('substruct' in field)
                    result[field.name] = parseSubStruct(field.substruct);
                else
                    result[field.name] = field.parser(state);
            }
            return result;
        }

        return parseSubStruct(state.struct);
    },

    //Parsing binary object header + body to object
    parseBinaryObject(data){
        let result = [];
        let state = {
            part    : bundle_str.BIN_BLOCK_STORAGE_VERSION,
            data    : data,
            offset  : 0
        };

        state.header_size = this.parseBinaryInt32(state);
        state.struct = this.parseBinaryStruct(state);
        while(state.offset < state.data.byteLength){
            if(!this.parseBinaryInt8(state))
                result.push(this.parseBinaryRow(state));
        }

        return result;
    }
}