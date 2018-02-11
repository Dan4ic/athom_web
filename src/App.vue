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
                <span>{{ 'CURRENT_TIME' | lang }}: {{hwDateTime}}</span>
            </v-footer>
        </v-app>

    </div>
</template>

<script>
    export default {
        name: 'App',
        computed: {
            theme(){
                return this.$store.state.display.theme;
            },
            currentTime(){
                if (!this.hwDateTime)
                    return "--.--.---- --:--:--";
                else
                    return this.hwDateTime;
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
        min-width: 580px;;
    }

    #mainmenu a {
        text-decoration: none;
    }

</style>
