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
            is_reloading_ap_list : false,
            client_ip: '0.0.0.0',
            internet_status : 'DISCONNECTED',
            commit : null,
            sync_with_ntp: true,
        },
        datetime : {
            hw_datetime : null,                 //Original time from controller
            sync_datetime : null,               //Moment when hw_date was recived
            curr_datetime   : null,             //Visible date and time
            time_zone_offset : null             //Timezone
        }
    },

    mutations : {

        //Set flag of synchronize with NTP server
        setSyncWithNTP(state, value){
            state.net.sync_with_ntp = value;
        },

        //Set Internet status
        setInternetStatus(state, value){
            state.net.internet_status = value;
        },

        //Set client IP (when connected to access point)
        setIP(state, value){
            state.net.client_ip = value;
        },

        //Set own access point name
        setAPSSID(state, value){
            state.net.ap_ssid   = value;
        },

        //Set access point for connection
        setSTASSID(state, value){
            state.net.sta_ssid  = value;
        },

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
        setLang(state, lang){
            state.display.lang = lang;
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
            state.datetime.curr_datetime    = time;
        }

    },

    actions : {
        //Put configuration to controller
        putConfiguration(context, config){

            context.commit('incNetPending');
            Axios.put(consts.REST.CONFIG, config.data).then((response) => {
                context.commit('decNetPending');

                context.dispatch('applyState', response.data);

                if('success' in config)
                    config['success'](config, this);

                this.$bus.$emit(consts.EVENTS.PUT_CONFIG_SUCCESS);

            }).catch(() => {
                context.commit('decNetPending');

                if('error' in config)
                    config['error'](config, this);

                this.$bus.$emit(consts.EVENTS.PUT_CONFIG_ERROR);
                this.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('NETWORK_ERROR'));
            });

        },

        //Reload available access point list
        refreshAccessPointsList(context){

            if(context.state.net.is_reloading_ap_list)
                return;

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

        //Apply new control state to store
        applyState(context, state){
            try {
                context.commit('setTime', +state.time.current);
                context.commit('setTimezoneOffset', state.time.offset);
                context.commit('setAPAvailable', state.net.ap_list);
                context.commit('setClientIP', state.net.client_ip);
                context.commit('setFirmwareVersion', state.system.firmware);

                if(state.display.theme && state.display.theme.length)
                    context.commit('setTheme', state.display.theme);

                if(state.display.lang && state.display.lang.length)
                    context.commit('setLang', state.display.lang);

                context.commit('setAPSSID', state.net.ap_ssid);
                context.commit('setSTASSID', state.net.sta_ssid);
                context.commit('setInternetStatus', state.net.internet_status);
                context.commit('setIP', state.net.ip);
                context.commit('setSyncWithNTP', !!state.net.sync_with_ntp);

                console.info('Firmware ', state.system.firmware, ' commit ', state.system.commit);
            } catch (e) {
                this.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('STATE_ERROR'));
                console.log(e);
            }
        },

        //Reload available access point list
        reloadState(context){
            context.commit('incNetPending');

            Axios.get(consts.REST.STATE).then((response) => {
                context.commit('decNetPending');
                context.dispatch('applyState', response.data);
            }).catch(function(){
                context.commit('decNetPending');
            });
        },

        //Initiation function
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

                context.dispatch('reloadState');
                context.commit('decNetPending');

            });

        },

    }

}