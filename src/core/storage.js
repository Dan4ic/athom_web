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
            ap_available : []
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
            Axios.get(consts.REST.TIME).then((response) => {
                context.commit('setTime', +response.data);
            });
        },

        initData(context){

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