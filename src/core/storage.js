import Axios from 'axios';
import consts from "./consts";

export default {
    state : {
        is_net_dending : 1,
        user: {
            first_enter : true
        },
        system : {
            firmware_v : null,
        },
        display : {
            lang : "en",
            theme : "dark",
            is_mobile : false,
        },
        net : {
            ap_ssid : null,
            ap_password : null,
            sta_ssid : null,
            sta_password : null,
            ap_available : [],
            is_reloading_ap_list : true,
            client_ip: '0.0.0.0',
            internet_status : 'DISCONNECTED'
        },
        datetime : {
            hw_datetime : null,                 //Original time from controller
            sync_datetime : null,               //Moment when hw_date was recived
            curr_datetime   : null,             //Visible date and time
            time_zone_offset : null             //Timezone
        }
    },

    mutations : {

        //Increment count of active sockets
        incNetPending(state){
            state.is_net_dending++;
        },

        //Decrement count of active sockets
        decNetPending(state){
            if(state.is_net_dending > 0)
                state.is_net_dending--;
        },


        //Flag of mobile device
        setIsMobile(state, value){
            state.display.is_mobile = value;
        },

        //Set firmware version
        setFirmwareVersion(state, value){
            state.system.firmware_v = value;
        },

        //Set flag of reloading process
        setReloadingAPList(state, value){
            state.net.is_reloading_ap_list = value;
        },

        //Set theme
        setUserFirstEnter(state, value){
            state.user.first_enter = value;
        },

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

        //Set timezone offset
        setTimezoneOffset(state, offset){
            state.datetime.time_zone_offset = offset;
        },

        //Update current hardware time after recalculation
        updateCurrentTime(state, time){
            state.datetime.curr_datetime    = (new Date).getTime();
        }

    },

    actions : {

        //Put configuration to controller
        putConfiguration(context, config){

            context.commit('incNetPending');
            Axios.put(consts.REST.CONFIG, config.data).then((response) => {
                context.commit('decNetPending');

                if('success' in config)
                    config['success'](config, this);

                this.$bus.$emit(consts.EVENTS.PUT_CONFIG_ERROR);

            }).catch(() => {
                context.commit('decNetPending');

                if('error' in config)
                    config['error'](config, this);

                this.$bus.$emit(consts.EVENTS.PUT_CONFIG_SUCCESS);
            });

        },

        //Reload available access point list
        refreshAccessPointsList(context){

            context.commit('setReloadingAPList', true);
            context.commit('incNetPending');

            Axios.get(consts.REST.AP_AVAILABLE).then((response) => {
                context.commit('decNetPending');
                context.commit('setAPAvailable', response.data);
                context.commit('setReloadingAPList', false);
            }).catch(function(){
                context.commit('decNetPending');
                context.commit('setReloadingAPList', false);
            });

        },

        //Reload available access point list
        reloadState(context){

            if(context.state.net.is_reloading_ap_list)
                return;

            context.commit('setReloadingAPList', true);
            context.commit('incNetPending');

            Axios.get(consts.REST.STATE).then((response) => {
                context.commit('decNetPending');
                context.commit('setTime', +response.data.time.current);
                context.commit('setAPAvailable', response.data.net.ap_list);
                context.commit('setClientIP', response.data.net.client_ip);
                context.commit('setFirmwareVersion', response.data.system.firmware);
                context.commit('setReloadingAPList', false);
            }).catch(function(){
                context.commit('decNetPending');
                context.commit('setReloadingAPList', false);
            });
        },

        initData(context){

            //Autodetect language
            context.commit('setLang', (navigator.language || navigator.userLanguage).toLowerCase());

            //Loading available access points
            this.$bus.$on(consts.EVENTS.APP_IS_LOADED, (messages) => {

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

                context.commit('decNetPending');

            });

        },

    }

}