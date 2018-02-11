<template>
    <v-form ref="form" lazy-validation>
        <v-card>
            <v-card-title primary-title>
                <v-layout row wrap>
                    <h1>{{'DATE_TIME' | lang}}</h1>
                    <v-flex xs12>
                        <v-date-picker v-model="curr_date" landscape></v-date-picker>
                    </v-flex>
                    <v-flex xs12>
                        <v-time-picker v-model="curr_time" landscape format="24hr"></v-time-picker>
                    </v-flex>
                </v-layout>
            </v-card-title>
            <v-card-actions text-xs-right>
                <v-btn @click="submit">{{'SUBMIT' | lang }}</v-btn>
                <v-btn @click="submit">{{'RESET' | lang }}</v-btn>
                <v-btn @click="submit">{{'CURRENT' | lang }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>

    import consts from './../../core/consts';

    export default {
        name: 'SettingsNetwork',
        computed: {
        },
        methods: {
            submit(){
            }
        },
        data () {
            return {
                curr_date : null,
                curr_time : new Date(),
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
