import Axios from 'axios';
import Apps from './applications';
import consts from "consts";

export default {
    state: {
        is_net_pending: 1,                      //Counter of NET requests
        user: {
            first_enter: true                   //True if first enter user on controller
        },
        system: {
            firmware_v: null,                   //Current firmware
        },
        display: {
            lang: "en",                         //Lang interface
            theme: "dark",                      //Interface theme
            is_mobile: false,                   //Is mobile device
        },
        net: {
            ap_ssid: null,                      //SSID of own access point
            ap_password: null,                  //Password of own access point
            sta_ssid: null,                     //SSID for connect access point
            sta_password: null,                 //Password for connect access point
            ap_available: [],                   //Available access points list
            is_reloading_ap_list: false,        //Is processing reloading acess points list
            client_ip: '0.0.0.0',               //Own IP
            internet_status: 'DISCONNECTED',    //Internet connection status
            commit: null,                       //Current git commit of the platform
            sync_with_ntp: true,                //If true controller will try get time from NTP server
        },
        datetime: {
            hw_datetime: null,                  //Original time from controller
            sync_datetime: null,                //Moment when hw_date was received
            curr_datetime: null,                //Visible date and time
            time_zone_offset: null              //Timezone
        },
        apps: {
            profiles: null                      //Profiles of applications
        }
    },

    mutations: {
        //Set profiles of applications
        setProfiles(state, profiles) {
            for(let appid in profiles) {
                let profile = profiles[appid];
                if ('storage' in profile && 'objects' in profile.storage) {
                    let object_struct = require('./storage-object');
                    object_struct.state.$namespace = profile.name;
                    object_struct.state.$header = null;
                    for(let object in profile.storage.objects)
                        object_struct.state[object] = [];

                    if(!(profile.name in state))
                        this.registerModule(profile.name, require('./storage-collector'));

                    this.registerModule([profile.name, 'data'], object_struct);
                    this.dispatch('Lucerna/data/reload', 'dots');
                }
                if ('components' in profile)
                    for (let cname in profile.components) {
                        if (!(cname in Vue.options.components)) {
                            console.log('Register component ', cname);
                            if(process.env.NODE_ENV === 'production')
                                Vue.component(cname, Apps.makePromisLoadComponent(`/apps/${appid}/${profile.components[cname].source}`, cname));
                            else
                                Vue.component(cname, Apps.makePromisLoadComponent(profile.components[cname].source, cname));
                        }
                    }
            };
            state.apps.profiles = profiles;
        },

        //Set flag of synchronize with NTP server
        setSyncWithNTP(state, value) {
            state.net.sync_with_ntp = value;
        },

        //Set Internet status
        setInternetStatus(state, value) {
            state.net.internet_status = value;
        },

        //Set client IP (when connected to access point)
        setIP(state, value) {
            state.net.client_ip = value;
        },

        //Set own access point name
        setAPSSID(state, value) {
            state.net.ap_ssid = value;
        },

        //Set access point for connection
        setSTASSID(state, value) {
            state.net.sta_ssid = value;
        },

        //Increment count of active sockets
        incNetPending(state) {
            state.is_net_pending++;
        },

        //Decrement count of active sockets
        decNetPending(state) {
            if (state.is_net_pending > 0)
                state.is_net_pending--;
        },

        //Flag of mobile device
        setIsMobile(state, value) {
            state.display.is_mobile = value;
        },

        //Set firmware version
        setFirmwareVersion(state, value) {
            state.system.firmware_v = value;
        },

        //Set flag of reloading process
        setReloadingAPList(state, value) {
            state.net.is_reloading_ap_list = value;
        },

        //Set theme
        setUserFirstEnter(state, value) {
            state.user.first_enter = value;
        },

        //Set theme
        setLang(state, lang) {
            state.display.lang = lang;
        },

        //Set ip
        setClientIP(state, ip) {
            state.net.client_ip = ip;
        },

        //Set theme
        setTheme(state, theme) {
            state.display.theme = theme;
        },

        //Set available access points
        setAPAvailable(state, list) {
            state.net.ap_available = list;
        },

        //Set time (only for storage)
        setTime(state, time) {
            state.datetime.hw_datetime = time;
            state.datetime.sync_datetime = (new Date).getTime();
            state.datetime.curr_datetime = time;
        },

        //Set timezone offset
        setTimezoneOffset(state, offset) {
            state.datetime.time_zone_offset = offset;
        },

        //Update current hardware time after recalculation
        updateCurrentTime(state, time) {
            state.datetime.curr_datetime = time;
        },

    },

    actions: {
        //Put configuration to controller
        putConfiguration(context, config) {

            context.commit('incNetPending');
            Axios.put(consts.REST.CONFIG, config.data).then((response) => {
                context.commit('decNetPending');

                context.dispatch('applyState', response.data);

                if ('success' in config)
                    config['success'](config, this);

                this.$bus.$emit(consts.EVENTS.PUT_CONFIG_SUCCESS);

            }).catch(() => {
                context.commit('decNetPending');

                if ('error' in config)
                    config['error'](config, this);

                this.$bus.$emit(consts.EVENTS.PUT_CONFIG_ERROR);
                this.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('NETWORK_ERROR'));
            });

        },

        //Reload available access point list
        refreshAccessPointsList(context) {

            if (context.state.net.is_reloading_ap_list)
                return;

            context.commit('setReloadingAPList', true);
            context.commit('incNetPending');

            Axios.get(consts.REST.AP_AVAILABLE).then((response) => {
                context.commit('decNetPending');
                context.commit('setAPAvailable', response.data);
                context.commit('setReloadingAPList', false);
            }).catch(function () {
                context.commit('decNetPending');
                context.commit('setReloadingAPList', false);
            });

        },

        //Apply new profile of applications
        applyProfile(context, profile) {
            context.commit('setProfiles', profile);
        },

        //Apply new control state to store
        applyState(context, state) {
            try {
                context.commit('setTime', +state.time.current);
                context.commit('setTimezoneOffset', state.time.offset);
                context.commit('setAPAvailable', state.net.ap_list);
                context.commit('setClientIP', state.net.client_ip);
                context.commit('setFirmwareVersion', state.system.firmware);

                if (state.display.theme && state.display.theme.length)
                    context.commit('setTheme', state.display.theme);

                if (state.display.lang && state.display.lang.length)
                    context.commit('setLang', state.display.lang);

                context.commit('setAPSSID', state.net.ap_ssid);
                context.commit('setSTASSID', state.net.sta_ssid);
                context.commit('setInternetStatus', state.net.internet_status);
                context.commit('setIP', state.net.client_ip);
                context.commit('setSyncWithNTP', !!state.net.sync_with_ntp);

                console.info('Firmware ', state.system.firmware, ' commit ', state.system.commit);
            } catch (e) {
                this.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('STATE_ERROR'));
                console.error(e);
            }
        },

        //Reload profile of applications
        reloadProfile(context) {
            context.commit('incNetPending');

            Axios.get(consts.REST.PROFILE).then((response) => {
                context.commit('decNetPending');
                context.dispatch('applyProfile', response.data);
                context.dispatch('reloadState');
            }).catch(function (e) {
                context.commit('decNetPending');
                console.error('Error of loading profile', e);
            });
        },
        
        //Reload available access point list
        reloadState(context) {
            context.commit('incNetPending');

            Axios.get(consts.REST.STATE).then((response) => {
                context.commit('decNetPending');
                context.dispatch('applyState', response.data);
            }).catch(function () {
                context.commit('decNetPending');
            });
        },

        //Initiation function
        initData(context) {

            //Autodetect language
            context.commit('setLang', (navigator.language || navigator.userLanguage).toLowerCase());

            //Loading available access points
            this.$bus.$on(consts.EVENTS.UBUS_MESSAGE, (action, content) => {
                if (action == consts.UBUS.CURRENT_TIME)
                    context.commit('setTime', +atob(content) * 1000);
            });

            //Loading available access points
            this.$bus.$on(consts.EVENTS.CORE_IS_LOADED, (messages) => {

                //Init current time refresher
                if (!('hwDateTimeTimer' in window)) {
                    window.hwDateTimeTimer = setInterval(function () {
                        context.commit('updateCurrentTime', (new Date).getTime()
                            - context.state.datetime.sync_datetime
                            + context.state.datetime.hw_datetime
                        );
                    }, 1000);
                }

                context.dispatch('reloadProfile');
                context.commit('decNetPending');

            });

        },

    }

}