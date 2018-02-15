<template>
    <v-form v-model="is_valid" :lazy-validation="lazyValidation" ref="form">
        <v-card>
            <v-card-title primary-title>
                <v-layout row wrap>
                    <h1>{{'ACCESS_POINT' | lang }}</h1>
                    <v-flex xs12>
                        <v-text-field
                                :label="'NAME' | lang "
                                v-model="apSSID"
                                :rules="[validateAPName]"
                                :counter="32"
                                required
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                :label="lblPassword(ap_password)"
                                v-model="ap_password"
                                :append-icon="show_pswd_ap ? 'visibility' : 'visibility_off'"
                                :append-icon-cb="() => (show_pswd_ap = !show_pswd_ap)"
                                :type="!show_pswd_ap ? 'password' : 'text'"
                                :counter="32">
                        </v-text-field>
                    </v-flex>
                    <h1>{{'INTERNET_CONNECTION' | lang }}</h1>
                    <v-flex xs12>
                        <v-layout row>
                            <v-flex xs11 tile flat>
                                <v-select
                                        :label="'ACCESS_POINT' | lang"
                                        v-model="staSSID"
                                        :items="ap_list"
                                        :rules="[v => !!v || 'Item is required']"
                                        :disabled="isAPListReloading"
                                        required
                                ></v-select>
                            </v-flex>
                            <v-flex xs1 style="padding-top: 12px;">
                                <v-btn v-if="!isAPListReloading" icon @click="doRefreshAPList">
                                    <v-icon>refresh</v-icon>
                                </v-btn>
                                <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
                            </v-flex>
                        </v-layout>
                        <v-flex xs12>
                            <v-text-field
                                    :label="lblPassword(sta_password)"
                                    type="password"
                                    v-model="sta_password"
                                    :disabled="staSSID=='DISABLE'"
                                    :append-icon="show_pswd_sta ? 'visibility' : 'visibility_off'"
                                    :append-icon-cb="() => (show_pswd_sta = !show_pswd_sta)"
                                    :type="!show_pswd_sta ? 'password' : 'text'"
                                    :counter="32">
                            </v-text-field>
                        </v-flex>
                    </v-flex>
                </v-layout>
            </v-card-title>
            <v-card-actions v-if="!hideActions" text-xs-right>
                <v-btn @click="submit" :disabled="!is_valid">{{'SUBMIT' | lang}}</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>

    import template from './Template.vue'

    let CONST_DISABLE_CONNECT = 'DISABLE';

    export default {
        name: 'SettingsNetwork',
        extends: template,
        methods: {
            validateAPName(value) {
                if (!value || value.length < 6 || !/[a-zA-Z0-9]/.test(value))
                    return Vue.filter('lang')('ERROR_AP_NAME');
                else
                    return true;
            },
            doRefreshAPList() {
                this.sta_ssid = "";
                this.$store.dispatch('refreshAccessPointsList');
            },

            lblPassword(password) {
                if (!password || !password.length)
                    return Vue.filter('lang')('PASSWORD_NO_CHANGE')
                else
                    return Vue.filter('lang')('PASSWORD')
            },

            submit() {
                if (this.$refs.form.validate()) {

                    let data = {
                        net : {
                            ap_ssid : this.apSSID,
                            sta_ssid : this.staSSID,
                        }
                    };

                    if(this.ap_password && this.ap_password.length)
                        data.net.ap_password    = this.ap_password;

                    if(this.sta_password && this.sta_password.length)
                        data.net.sta_password   = this.sta_password;

                    this.$store.dispatch('putConfiguration', {data : data});
                }
            },

        },
        computed: {
            ap_list() {
                let result = [{
                    value: CONST_DISABLE_CONNECT,
                    text: Vue.filter('lang')('NO_CONNECT')
                }];

                this.$store.state.net.ap_available.map(function (item) {
                    result.push({
                        value: item.name,
                        text: item.name
                    });
                });

                return result;
            },
            apSSID : {
                get(){
                    if(!this.ap_ssid)
                        return this.$store.state.net.ap_ssid;
                    else
                        return this.ap_ssid;
                },
                set(value){
                    this.ap_ssid    = value;
                }
            },
            staSSID : {
                get(){
                    if(!this.sta_ssid){
                        if(this.$store.state.net.sta_ssid && this.$store.state.net.sta_ssid.length)
                            return this.$store.state.net.sta_ssid;
                        else
                            return CONST_DISABLE_CONNECT;
                    } else
                        return this.sta_ssid;
                },
                set(value){
                    this.sta_ssid   = value;
                }
            }

        },
        data() {
            return {
                is_valid: this.lazyValidation,
                show_pswd_ap: false,
                show_pswd_sta: false,
                ap_ssid: null,
                ap_password: "",
                sta_ssid: null,
                sta_password: ""
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
