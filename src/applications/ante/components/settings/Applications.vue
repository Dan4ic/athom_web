<template>
    <v-form ref="form" lazy-validation>
        <v-card style="width: 100%">
            <v-card-title primary-title>
                <v-layout row wrap>
                    <h1>{{'APPS_TITLE' | lang}}</h1>
                    <v-flex xs12>
                        Applications<br>Applications<br>Applications<br>Applications<br>Applications<br>Applications<br>Applications<br>Applications<br>Applications<br>Applications<br>Applications<br>
                    </v-flex>
                </v-layout>
            </v-card-title>
        </v-card>
    </v-form>
</template>

<script>

    import consts from 'consts';
    import template from './Template.vue'

    export default {
        name: 'Applications',
        extends : template,
        computed: {

        },
        methods: {

        },
        data () {
            return {
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
