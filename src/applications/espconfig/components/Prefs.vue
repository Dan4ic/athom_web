<template>
    <v-form ref="form" lazy-validation>
            <v-card style="width: 100%">
                <v-card-title primary-title>
                    <v-container style="padding: 0">
                    <v-layout row>
                        <h1>{{'ESP_CONF_TITLE' | lang}}</h1>
                    </v-layout>
                    <v-layout :wrap="isMobileScreen">
                        <v-flex :xs12="isMobileScreen" :xs6="!isMobileScreen" class="col1">
                            <v-select
                                    :label="'PWM_RESOLUTION' | lang"
                                    v-model="pwmresolution"
                                    :items="pwmresolutions"
                                    class="col1"
                                    required
                            ></v-select>
                        </v-flex>
                        <v-flex :xs12="isMobileScreen" :xs6="!isMobileScreen" class="col2">
                            <v-text-field
                                    v-model="pwmFrequency"
                                    :label="'PWM_FREQUENCY' | lang"
                                    type="number"
                                    min="1"
                                    :max="'maxFrequency'"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    </v-container>
                </v-card-title>
            </v-card>
    </v-form>
</template>

<script>

    import template from './Template.vue'

    export default {
        name: 'ESPConfigPrefs',
        extends : template,
        computed: {
            lang: {
                get(){
                    return this.$store.state.display.lang;
                }
            },
            pwmresolution: {
                get(){
                    return {text: '15 bit', value: '15'};
                }
            },
            maxFrequency(){
                return 80000000 / (2 ^ this.data.pwmresolution.value)
            }


        },
        data () {
            return {
                pwmresolutions : [
                    {text: '10 bit', value: '10'},
                    {text: '11 bit', value: '11'},
                    {text: '12 bit', value: '12'},
                    {text: '13 bit', value: '13'},
                    {text: '14 bit', value: '14'},
                    {text: '15 bit', value: '15'}
                ],
                pwmFrequency : 0
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
