<template>
    <div id="app">
        <v-app  id="inspire" :light="theme=='light'" :dark="theme=='dark'">
            <v-navigation-drawer id="mainmenu" clipped fixed v-model="drawer" app>
                <v-list dense>
                    <router-link :to="{name:'Dashboard'}">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <v-icon>dashboard</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{'DASHBOARD' | lang}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </router-link>
                    <router-link :to="{name:'Settings'}">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <v-icon>settings</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{'SETTINGS' | lang}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </router-link>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar app fixed clipped-left>
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title>SmartTank</v-toolbar-title>
            </v-toolbar>
            <v-content>
                <router-view/>
            </v-content>
            <v-footer app fixed :style="isMobileScreen?{'display':'table-row'}:{}">
            <span class="status_label" :style="isMobileScreen?{'display':'table-cell'}:{}">
                <template v-if="!isMobileScreen">{{ 'CURRENT_TIME' | lang }}:</template>
                {{currentTime}}
            </span>
                <span class="status_label" :style="isMobileScreen?{'display':'table-cell'}:{}">
                <template v-if="!isMobileScreen">{{ 'IP' | lang }}:</template>
                {{this.$store.state.net.client_ip}}
            </span>
                <span class="status_label" :style="isMobileScreen?{'display':'table-cell'}:{}">
                <template v-if="!isMobileScreen">{{ 'INTERNET' | lang }}:</template>
                {{this.$store.state.net.internet_status | lang}}
            </span>
                <span v-if="!isMobileScreen" class="status_label">
                {{ 'FIRMWARE' | lang }}: {{this.$store.state.system.firmware_v}}
                    [{{isNetPending}}]
            </span>
            </v-footer>

            <v-progress-linear
                    v-if="isNetPending"
                    style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; height: 5px; margin: 0px;"
                    :indeterminate="true">

            </v-progress-linear>

            <v-alert v-if="alerts.length"
                    :type="alerts[0].type"
                    :value="true"
                    transition="scale-transition"
                    style="position: fixed; right: 16px; top: 16px; width: 400px; max-width: 80%; z-index: 2000"
            >
                <span v-html="alerts[0].message"></span>
                <v-btn
                        flat
                        @click="alerts = alerts.slice(1)"
                        style="float: right; margin-left: 4px; margin-right: 0;margin-top: 0;"
                >
                    {{'CLOSE' | lang }}
                </v-btn>
            </v-alert>

        </v-app>

    </div>
</template>

<script>

    import consts from 'consts';
    import ConfigHelper from './components/ConfigHelper.vue';
    import Settings from './components/Settings.vue';
    import Dashboard from './components/Dashboard.vue';

    export default {
        name: 'App',
        beforeCreate(){
            this.$router.addRoutes([
                {
                    path: '/config_helper',
                    name: 'ConfigHelper',
                    component: ConfigHelper
                },
                {
                    path: '/settings',
                    name: 'Settings',
                    component: Settings
                },
                {
                    path: '/dashboard',
                    name: 'Dashboard',
                    component: Dashboard
                },
                {
                    path: '/',
                    name: 'Root',
                    component: Dashboard
                }

            ]);
        },
        mounted(){
            //Detect first enter

            if($store.state.user.first_enter) {
                $store.commit('setUserFirstEnter', false);
                this.$router.push('/config_helper');
            } else {
                this.$router.push('/dashboard');
            }

            //Loading available access points
            this.$bus.$on(consts.EVENTS.ALERT, (type, messages) => {

                this.alerts.push({
                    type : type,
                    message : messages
                });

            });

            this.$bus.$on(consts.EVENTS.APP_IS_LOADED, (messages) => {

                setTimeout(()=>{
                   this.is_app_ready = true;
                }, 50);

            });

        },
        computed: {
            theme(){
                return this.$store.state.display.theme;
            },
            currentTime(){
                return this.getFormattedDate(this.hwDateTime, this.$store.state.display.lang)
                        + ' ' + this.getFormattedTime(this.hwDateTime,  this.$store.state.display.lang);
            },
            isNetPending(){
                return this.$store.state.is_net_pending;
            }
        },
        watch : {
            drawer(val){

                setTimeout(function(){
                    this.$bus.$emit(consts.EVENTS.DO_SCREEN_REBUILD);
                }, 150)

            }
        },
        data(){
            return {
                drawer: null,
                alerts : []
            }
        }
    }
</script>

<style>

    .status_label {
        display: block;
        float: left;
        margin: 12px;
    }

    #mainmenu a {
        text-decoration: none;
    }

    .cpr:before{
        font-size: 10px;
        line-height: 12px;
        vertical-align: top;
        content: '\A9';
    }

    /* Custom datetime picker stylers */

    .time-picker-title__time .picker__title__btn, .time-picker-title__time span {
        height: 56px !important;
        font-size: 60px !important;
    }

    .picker__body {
        margin: auto !important;
    }

    .theme--dark .list__tile {
        color: #fff;
    }

    .theme--light .list__tile{
        color: rgba(0,0,0,.87);
    }

    .theme--light .card {
        -webkit-box-shadow: none !important;
        box-shadow: none !important;
        border: solid 1px rgba(0,0,0,.1);
        border-radius: 4px;
    }

    @media (max-width: 599px) {
        table.table tbody td:first-child, table.table tbody td:not(:first-child),
        table.table tbody th:first-child, table.table tbody th:not(:first-child),
        table.table thead td:first-child, table.table thead td:not(:first-child),
        table.table thead th:first-child, table.table thead th:not(:first-child) {
            padding: 0 14px;
        }

        .container {
            padding: 2px !important;
        }

    }


</style>
