import Vue from 'vue';
import Axios from 'axios';
import consts from "./consts";

export default {
    state : {
        display : {
            lang : "en",
            theme : "dark"
        },
        net : {
            ap_ssid : null,
            sta_ssid : null,
            ap_available : [],
            client_ip: '0.0.0.0',
            internet_status : 'DISCONNECTED'
        },
        datetime : {
            hw_datetime : null,
            sync_datetime : null,
            curr_datetime   : null
        }
    },

    mutations : {

        //Set theme
        setLang(state, theme){
            state.display.lang = theme;
        },

        //Set ip
        setClientIP(state, ip){
            state.net.client_ip = ip;
        },

        //Set theme
        setTheme(state, theme){
            state.display.theme = theme;
        },

        //Set available access points
        setAPAvailable(state, list){
            state.net.ap_available  = list;
        },

        //Set time (only for storage)
        setTime(state, time){
            state.datetime.hw_datetime      = time;
            state.datetime.sync_datetime    = (new Date).getTime();
            state.datetime.curr_datetime    = time;
        },

        //Update current hardware time after recalculation
        updateCurrentTime(state, time){
            state.datetime.curr_datetime    = (new Date).getTime();
        }

    },

    actions : {

        //Reload available access point list
        refreshAccessPointsList(context){
            Axios.get(consts.REST.AP_AVAILABLE).then((response) => {
                context.commit('setAPAvailable', response.data);
            });

        },

        //Reload available access point list
        reloadState(context){
            Axios.get(consts.REST.STATE).then((response) => {
                context.commit('setTime', +response.data.time.current);
                context.commit('setAPAvailable', response.data.net.ap_list);
                context.commit('setClientIP', response.data.net.client_ip);
            });
        },

        initData(context){

            //Autodetect language
            context.commit('setLang', (navigator.language || navigator.userLanguage).toLowerCase());

            //Loading available access points
            this.$bus.$on('application-loaded', (messages) => {

                //Init current time refresher
                if(!('hwDateTimeTimer' in window)){
                    window.hwDateTimeTimer = setInterval(function(){
                        context.commit('updateCurrentTime', (new Date).getTime()
                            - context.state.datetime.sync_datetime
                            + context.state.datetime.hw_datetime
                        );
                    },1000);
                }

                context.dispatch('refreshAccessPointsList');
                context.dispatch('reloadState');

            });

        },

    }

}