<template>
    <v-form ref="form" lazy-validation>
        <v-card style="width: 100%">
            <v-card-title primary-title>
                <v-container style="padding: 0">
                    <v-layout row>
                        <h1>{{'LEDC_CONF_TITLE' | lang}}</h1>
                    </v-layout>
                    <v-layout :wrap="isMobileScreen">
                        <v-flex :xs12="isMobileScreen" :xs6="!isMobileScreen" class="col1">
                            <v-select
                                    :label="'PWM_RESOLUTION' | lang"
                                    v-model="pwmresolution"
                                    :items="pwmresolutions"
                                    :hint="`10-15 bit`"
                                    persistent-hint
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
                                    :hint = maxFrequency.toString()
                                    persistent-hint
                                    required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <h3>{{'LEDC_GPIO_TITLE' | lang}}</h3>
                    </v-layout>
                    <v-layout :wrap="isMobileScreen">
                        <v-data-table
                                :headers="gpioHeaders"
                                :items="gpioItems"
                                class="elevation-1"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.pinNum }}</td>
                                <td class="text-xs-center">{{ props.item.gpioNum }}</td>
                                <td class="text-xs-center">{{ props.item.ledcChannel }}</td>
                                <td class="text-xs-right">{{ props.item.outputMode }}</td>
                                <td class="text-xs-right">{{ props.item.duty }}</td>
                            </template>
                            <template slot="pageText" slot-scope="props">
                                Pages {{ props.pageStart }} - {{ props.pageStop }} from {{ props.itemsLength }}
                            </template>
                        </v-data-table>

                    </v-layout>
                </v-container>
            </v-card-title>
            <v-card-actions text-xs-right>
                <v-btn @click="submit">{{'SUBMIT' | lang }}</v-btn>
                <v-btn @click="reset" flat>{{'RESET' | lang }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>
    /* eslint-disable indent */


    import template from './Template.vue'

    const consts = window.$consts;

    export default {
        name: 'ESPConfigPrefs',
        extends : template,
        data () {
            return {
                pwmresolutions: [ 10, 11, 12, 13, 14, 15 ],
                pwmFrequency: 2440,
                pwmresolution: 15,
                maxFrequency: 2440,
                gpioHeaders: [
                    { text: 'Pin#',     value: 'pinNum', align: 'left', sortable: true },
                    { text: 'GPIO#',    value: 'gpioNum', align: 'left', sortable: true },
                    { text: 'Channel',  value: 'ledcChannel' },
                    { text: 'Mode',     value: 'outputMode' },
                    { text: 'Duty',     value: 'duty' }
                ],
                gpioItems: [
                    { value: false, pinNum:  1, gpioNum: 32, ledcChannel:  0, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum:  2, gpioNum: 33, ledcChannel:  1, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum:  3, gpioNum: 26, ledcChannel:  2, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum:  4, gpioNum: 27, ledcChannel:  3, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum:  5, gpioNum: 14, ledcChannel:  4, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum:  6, gpioNum: 12, ledcChannel:  5, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum:  7, gpioNum: 13, ledcChannel:  6, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum:  8, gpioNum: 15, ledcChannel:  7, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum:  9, gpioNum:  2, ledcChannel:  8, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum: 10, gpioNum:  5, ledcChannel:  9, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum: 11, gpioNum: 18, ledcChannel: 10, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum: 12, gpioNum: 19, ledcChannel: 11, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum: 13, gpioNum: 21, ledcChannel: 12, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum: 14, gpioNum: 22, ledcChannel: 13, outputMode: 'PullUp', duty: 0 },
                    { value: false, pinNum: 15, gpioNum: 23, ledcChannel: 14, outputMode: 'PullUp', duty: 0 },
                ]
            }
        },
        methods: {
            submit () {
                this.$bus.$emit(consts.EVENTS.UBUS_MESSAGE, 'espconfig-put', JSON.stringify({res: this.pwmresolution, freq: this.pwmFrequency}))
            },
            reset () {

            }
        },
        watch: {
            pwmresolution : function (val) {
                this.maxFrequency = 80000000 / (1 << val)
                if (this.maxFrequency < this.pwmFrequency) {
                    this.pwmFrequency = this.maxFrequency;
                }
            },
            pwmFrequency : function (val) {
                if (this.maxFrequency < val) {
                    this.pwmFrequency = this.maxFrequency;
                }
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
