'use strict'

const consts = require('consts').default;
const Axios = require('axios');
const Binary = require('./storage-binary');
const Storage_builder = require('../../build/storage');

module.exports = {
    namespaced: true,
    state: {
    },

    mutations: {
        applyData(state, object, data){
            if(object in state) {
                state[object] = data;
            } else
                new Error('Undefined object storage ${object} for ${state.$namespace}');
        },
    },

    actions: {
        loadBinaryObject(context, data){
            context.commit('applyData', Binary.parseBinaryObject(data));
        },

        reload(context, object){
            this.commit('incNetPending');
            if(object in context.state) {
                Axios.get(
                    `http://192.168.1.60/apps/${context.state.$namespace}/data/${object}`,
                    {
                        responseType : 'arraybuffer'
                    }
                ).then((response) => {
                    this.commit('decNetPending');
                    context.dispatch('loadBinaryObject', response.data);
                    this.$bus.$emit(consts.EVENTS.STORE_RELOADED, object);
                }).catch((e) => {
                    console.log(`Error of loading storage object for ${context.state.$namespace}/data/${object}`, e);
                    this.commit('decNetPending');
                    this.$bus.$emit(consts.EVENTS.STORE_ERROR_RELOADED, object);
                });
            } else
                new Error('Undefined object storage ${object} for ${context.state.$namespace}');
        },

        post(context, object){
            this.commit('incNetPending');
            if(object in context.state) {
                //todo
                console.info(`Posted /apps/${context.state.namespace}/data/${object}`);
            }
        }
    }
}