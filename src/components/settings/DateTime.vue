<template>
    <v-form ref="form" lazy-validation>
        <v-card>
            <v-card-title primary-title>
                <v-layout row wrap>
                    <h1>{{'DATE_TIME' | lang}}</h1>
                    <template v-if="float">
                        <v-flex xs12>
                            <v-date-picker class="float_packer" v-model="curr_date" landscape></v-date-picker>
                            <v-time-picker class="float_packer" v-model="curr_time" landscape format="24hr"></v-time-picker>
                        </v-flex>
                    </template>
                    <template v-else>
                        <v-flex xs12>
                            <v-date-picker v-model="curr_date" landscape></v-date-picker>
                        </v-flex>
                        <v-flex xs12>
                            <v-time-picker v-model="curr_time" landscape format="24hr"></v-time-picker>
                        </v-flex>
                    </template>
                    <v-flex xs12>
                        <span style="display: block; height: 16px;"></span>
                        <v-checkbox v-bind:label="'NTP_SYNC' | lang" v-model="ntp_sync"></v-checkbox>
                    </v-flex>
                </v-layout>
            </v-card-title>
            <v-card-actions v-if="!hideActions" text-xs-right style="margin-top: -28px;">
                <v-btn @click="submit">{{'SUBMIT' | lang }}</v-btn>
                <v-btn @click="reset">{{'RESET' | lang }}</v-btn>
                <v-btn @click="current">{{'CURRENT' | lang }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>

    import consts from './../../core/consts';
    import template from './Template.vue'

    export default {
        name: 'SettingsNetwork',
        extends : template,
        computed: {

            curr_date : {
                get(){
                    if(this.custom_date)
                        return this.custom_date
                    else
                        return this.getFormattedDate(this.hwDateTime, 'vuetifyjs');
                },
                set(value){
                    this.custom_date = value;
                }
            },

            curr_time : {
                get(){
                    if(this.custom_time)
                        return this.custom_time
                    else
                        return this.getFormattedTime(this.hwDateTime, 'vuetifyjs');
                },
                set(value){
                    this.custom_time = value;
                }
            }

        },
        props :{
            float: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            current(){
                this.custom_date    = this.getFormattedDate(new Date, 'vuetifyjs');
                this.custom_time    = this.getFormattedTime(new Date, 'vuetifyjs');
            },
            reset(){
                this.custom_date    = null;
                this.custom_time    = null;
            },
            submit(){

            }
        },
        data () {
            return {
                custom_date : null,
                custom_time : null,
                ntp_sync : true
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
    .float_packer {
        float: left;
    }
    
</style>
