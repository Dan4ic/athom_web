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
        loadedAPAvailable(state, list){
            state.net.ap_available  = list;
        },

    },

    actions : {

        //Reload available access point list
        refreshAccessPointsList(context){
            Axios.get(consts.REST.AP_AVAILABLE).then((response) => {
                context.commit('loadedAPAvailable', response.data);
            });

        },

        initData(context){

            //Loading available access points
            this.$bus.$on('application-loaded', (messages) => {

                context.dispatch('refreshAccessPointsList');

            });

        },

    }

}