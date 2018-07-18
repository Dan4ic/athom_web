'use strict'

const consts = require('consts').default;
const Axios = require('axios');
const Binary = require('./storage-binary');

let urls_in_pending = [];

module.exports = {
    namespaced: true,
    state: {
    },

    mutations: {
        //Setting storage status
        $setStorageStatus(state, object){
            state.$status[object.name] = object.status;
        },

        //Setting new data to storage
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
                let url =
                    (process.env.NODE_ENV === 'development' ? (process.env.HW_DEVICE_URL ? process.env.HW_DEVICE_URL : '') : '')
                    + `/apps/${context.state.$namespace}/data/${object}`;
                if(urls_in_pending.indexOf(url) < 0) {
                    let url_index = urls_in_pending.push(url) - 1;
                    Axios.get(url,
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
                        this.$bus.$emit(consts.EVENTS.STORE_RELOADED, `${context.state.$namespace}/${object}`);
                        urls_in_pending.splice(url_index, 1);
                    }).catch((e) => {
                        console.log(`Error of loading storage object for ${context.state.$namespace}/data/${object}`, e);
                        this.commit('decNetPending');
                        this.$bus.$emit(consts.EVENTS.STORE_ERROR_RELOADED, `${context.state.$namespace}/${object}`);
                        urls_in_pending.splice(url_index, 1);
                    });
                }
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

            let url =
                (process.env.NODE_ENV === 'development' ? (process.env.HW_DEVICE_URL ? process.env.HW_DEVICE_URL : '') : '')
                + `/apps/${context.state.$namespace}/data/${object}`;
            Axios.post(url, formData,
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
                this.$bus.$emit(
                    consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR,
                    `Error of posting data for ${context.state.$namespace}/${object}` + (e.response.data ? '<br>' + e.response.data : '')
                );
            });
        }
    }
}