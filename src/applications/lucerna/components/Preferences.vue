<template>
    <v-form ref="form" lazy-validation>
        <v-card>
            <v-card-title primary-title>
                <v-container style="padding: 0">
                    <v-layout row>
                        <h1>{{'PREFS_TITLE' | lang}}</h1>
                    </v-layout>
                    <v-layout :wrap="isMobileScreen">
                        <v-flex :xs12="isMobileScreen" :xs6="!isMobileScreen" class="col1">
                            <v-text-field
                                    v-model="daysNumber"
                                    class="col1"
                                    :label="'DAYS_NUMBER' | lang"
                                    type="number"
                                    min="1"
                                    max="365"
                            ></v-text-field>
                        </v-flex>
                        <v-flex :xs12="isMobileScreen" :xs6="!isMobileScreen" class="col2">
                            <v-text-field
                                    v-model="channelsNumber"
                                    :label="'CHANNELS_NUMBER' | lang"
                                    type="number"
                                    min="1"
                                    max="16"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-title>
            <v-card-actions text-xs-right>
                <v-btn @click="submit">{{'SUBMIT' | lang }}</v-btn>
                <v-btn flat>{{'RESET' | lang }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>

    import VCardMedia from "vuetify/es5/components/VCard/VCardMedia";

    export default {
        components: {VCardMedia},
        name: 'SettingsLucerna',
        computed : {
            daysNumber: {
                get(){
                    return this.interval.width !== null ? this.interval.width / 86400
                        : this.$store.state.lucerna.interval.width / 86400;
                },
                set(value){
                    this.interval.width = value * 86400;
                }
            },
            channelsNumber: {
                get(){
                    return this.new_channelsNumber !== null ? this.new_channelsNumber
                        : this.$store.state.lucerna.channels.length
                },
                set(value){
                    this.new_channelsNumber = value;
                }
            }
        },
        methods : {
            submit(){
                this.$store.commit('lucerna/setIntervalWidth', this.daysNumber * 86400);
                this.$store.commit('lucerna/setChannelsNumber', this.channelsNumber);
            }
        },
        data () {
            return {
                new_channelsNumber : null,
                interval    : {
                    width       : null,
                    resolution  : null,
                    offset      : null
                },
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .col1 {
        padding-right: 4px;
    }

    .col2 {
        padding-left: 4px;
    }

</style>
