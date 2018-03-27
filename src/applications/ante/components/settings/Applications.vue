<template>
    <v-form ref="form" lazy-validation>
        <v-card style="width: 100%">
            <v-card-title primary-title>
                <v-layout row wrap>
                    <h1>{{'APPS_TITLE' | lang}}</h1>
                    <v-flex xs12>
                        <v-data-table
                                :headers="headers"
                                :items="appList"
                                hide-actions
                                class="elevation-1"
                        >
                            <template slot="items" slot-scope="props">
                                    <td v-if="!props.item.appid" width="100%" colspan="3">
                                        <a href="#" @click.prevent="doInstall">{{'INSTALL_NEW_APP' | lang}}</a>
                                    </td>
                                    <td v-if="props.item.appid" width="100%">{{ props.item.name }}</td>
                                    <td v-if="props.item.appid" width="1%" class="text-xs-left">{{ props.item.vendor }}</td>
                                    <td v-if="props.item.appid" width="1%" class="text-xs-right">
                                        <v-btn flat icon color="blue" @click="onUninstall(props.item)">
                                            <v-icon title="uninstall">delete</v-icon>
                                        </v-btn>
                                    </td>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
            </v-card-title>
        </v-card>
        <modal v-if="show_uninstall_modal">
            <h1 slot="title">{{'UNINSTALL_APP_TITLE' | lang}}</h1>
            <template slot="body">
                <div style="margin-bottom: 12px; width: 100%;"></div>
                <h2>{{selected_app.name}}</h2>
                <h3>{{'VENDOR' | lang}}: {{selected_app.vendor}}</h3>
                <div style="margin-bottom: 12px; width: 100%;"></div>
                <p slot="body">{{'UNINSTALL_APP_BODY' | lang}}</p>
            </template>
            <template slot="actions">
                <v-btn @click="show_uninstall_modal = false" >{{'CANCEL' | lang }}</v-btn>
                <v-btn @click="doUninstall" flat>{{'UNINSTALL' | lang }}</v-btn>
            </template>
        </modal>
    </v-form>
</template>

<script>

    import modal from './../Modal.vue';
    import consts from './../../consts';
    import template from './Template.vue'

    export default {
        name: 'Applications',
        components : {
            modal : modal,
        },
        extends : template,
        computed: {
            appList(){
                let result = [{
                    appid : null,
                    name : null,
                    vendor : null,
                }];
                if(this.$store.state.apps.profiles)
                    for(let appid in this.$store.state.apps.profiles){
                        let profile = this.$store.state.apps.profiles[appid];
                        result.push({
                            appid : appid,
                            name : profile.name,
                            vendor : profile.vendor,
                        });
                    }
                return result;
            }
        },
        methods: {
            doInstall(){

            },
            doUninstall(){

            },
            onUninstall(app){
                this.show_uninstall_modal = true;
                this.selected_app = app;
            }
        },
        data () {
            return {
                show_uninstall_modal : false,
                selected_app : null,
                headers: [
                    { text: Vue.filter('lang')('APPLICATION'), align: 'left', value: 'name' },
                    { text: Vue.filter('lang')('VENDOR'), align: 'left', value: 'vendor' },
                    { text: '', sortable : false, value: 'action' },
                ]
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    h3 {
        width: 100%;
    }

</style>
