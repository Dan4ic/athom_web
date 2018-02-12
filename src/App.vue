<template>
    <div id="app">
        <v-app id="inspire" :light="theme=='light'" :dark="theme=='dark'">
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
            <v-footer app fixed>
                <span class="status_label">{{ 'CURRENT_TIME' | lang }}: {{currentTime}} </span>
                <span class="status_label">{{ 'IP' | lang }}: {{this.$store.state.net.client_ip}} </span>
                <span class="status_label">{{ 'INTERNET' | lang }}: {{this.$store.state.net.internet_status | lang}} </span>
            </v-footer>
        </v-app>

    </div>
</template>

<script>

    export default {
        name: 'App',
        mounted(){

            //Detect first enter
            if($store.state.user.first_enter) {
                $store.commit('setUserFirstEnter', false);
                this.$router.push('/config_helper');
            }

            this.onResize();
            window.addEventListener('resize', this.onResize, { passive: true });

        },
        beforeDestroy () {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', this.onResize, { passive: true })
            }
        },
        computed: {
            theme(){
                return this.$store.state.display.theme;
            },
            currentTime(){
                return this.getFormattedDate(this.hwDateTime, this.$store.state.display.lang)
                        + ' ' + this.getFormattedTime(this.hwDateTime,  this.$store.state.display.lang);
            }
        },
        methods: {
            onResize () {
                this.$store.commit('setIsMobile', window.innerWidth < 600);
            }
        },
        watch : {
            drawer(val){

                setTimeout(function(){
                    this.$bus.$emit('do-screen-rebuild');
                }, 150)

            }
        },
        data(){
            return {
                drawer: null
            }
        }
    }
</script>

<style>

    @import 'assets/material_icons.css';
    @import '../node_modules/vuetify/dist/vuetify.min.css';

    #app {
        /* min-width: 600px; */
    }

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

</style>
