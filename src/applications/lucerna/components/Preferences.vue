<template>
    <v-form ref="form" lazy-validation>
        <v-card>
            <v-card-title primary-title>
                <v-layout row wrap>
                    <h1>{{'PREFS_TITLE' | lang}}</h1>
                </v-layout>
                <v-flex xs12>
                    <v-text-field
                            v-model="daysCount"
                            name="input-1"
                            :label="'DAYS_COUNT' | lang"
                            type="number"
                            min="1"
                            max="365"
                    ></v-text-field>
                </v-flex>
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
            daysCount: {
                get(){
                    return this.interval.width !== null ? this.interval.width / 86400
                        : this.$store.state.lucerna.interval.width / 86400;
                },
                set(value){
                    this.interval.width = value * 86400;
                }
            }
        },
        methods : {
            submit(){
                this.$store.commit('lucerna/setIntervalWidth', this.daysCount * 86400);
            }
        },
        data () {
            return {
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
</style>
