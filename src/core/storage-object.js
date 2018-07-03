'use strict'

const consts = require('consts').default;
const Axios = require('axios');
const Binary = require('./storage-binary');

module.exports = {
    namespaced: true,
    state: {
    },

    mutations: {
        applyData(state, object){
            if(object.name in state) {
                state[object.name] = object.data;
            } else
                new Error('Undefined object storage ${object.name} for ${state.$namespace}');
        },
    },

    actions: {
        reload(context, object){
            this.commit('incNetPending');
            if(object in context.state) {
                //todo need to remove IP
                Axios.get(
                    `http://192.168.1.60/apps/${context.state.$namespace}/data/${object}`,
                    {
                        responseType : 'arraybuffer'
                    }
                ).then((response) => {
                    this.commit('decNetPending');
                    context.commit('applyData',
                        {
                            'name' : object,
                            'data' : Binary.parseBinaryObject(response.data)
                        }
                    );
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
            let profile = null;
            for(let index in $store.state.apps.profiles){
                if($store.state.apps.profiles[index].name == context.state.$namespace)
                    profile = $store.state.apps.profiles[index];
            }

            if(!profile || !('storage' in profile) || !('objects' in profile.storage)
                || !(object in profile.storage.objects)){
                throw `Could not found profile for storage /apps/${context.state.$namespace}/data/${object}`;
            }

            this.commit('incNetPending');

            let formData = new FormData();
            formData.append(
                object,
                new Blob([Binary.makeBinaryObject(profile.storage.objects[object], context.state[object])]),
                `${object}.str`
            );

            //todo need to remove IP
            Axios.post(`http://192.168.1.60/apps/${context.state.$namespace}/data/${object}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then(() => {
                this.commit('decNetPending');
            })
            .catch((e) => {
                console.error(e);
                this.commit('decNetPending');
            });
        }
    }
}