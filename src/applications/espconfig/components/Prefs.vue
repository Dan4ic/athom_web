<template>
    <v-form ref="form" lazy-validation>
        <v-card style="width: 100%">
            <v-card-title primary-title>
                <v-container style="padding: 0">
                    <v-layout row>
                        <h1>{{'LEDC_CONF_TITLE' | lang}}</h1>
                    </v-layout>
                    <v-layout style="width: 100%" :wrap="isMobileScreen">
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
                                    :max="maxFrequency"
                                    :hint = maxFrequency.toString()
                                    persistent-hint
                                    required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <h3>{{'LEDC_GPIO_TITLE' | lang}}</h3>
                    </v-layout>
                    <v-layout row :wrap="isMobileScreen">
                        <v-data-table
                                :headers="gpioHeaders"
                                :items="gpioItems"
                                class="elevation-1"
                                style="width: 100%"
                        >
                            <template slot="items" slot-scope="props">
                                <td width="5%">{{ props.item.pinNum }}</td>
                                <td width="5%" class="text-xs-center">{{ props.item.gpioNum }}</td>
                                <td width="5%" class="text-xs-center">
                                    <v-select
                                            :items="ledcchannels"
                                            v-model="props.item.ledcChannel"
                                            single-line
                                    ></v-select>
                                </td>
                                <td class="text-xs-center">
                                        <v-slider thumb-label :max="100" v-model="props.item.duty"></v-slider>
                                    test
                                </td>
                                <td width="10%" class="text-xs-center">
                                    <v-btn small @click="setchannelparams(props.item)">SET</v-btn>
                                </td>
                            </template>
                            <template slot="pageText" slot-scope="props">
                                Items {{ props.pageStart }} - {{ props.pageStop }} from {{ props.itemsLength }}
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
                ledcchannels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                pwmFrequency: 2440,
                pwmresolution: 15,
                maxFrequency: 2440,
                gpioHeaders: [
                    { text: 'Pin',      value: 'pinNum', align: 'left', sortable: true },
                    { text: 'GPIO',     value: 'gpioNum', align: 'left', sortable: true },
                    { text: 'Channel',  value: 'ledcChannel' },
                    { text: 'Duty',     value: 'duty', align: 'left'},
                    { text: 'Set config', value: 'setduty'}
                ],
                gpioItems: [
                    { value: false, pinNum:  1, gpioNum: 32, ledcChannel:  1, duty: 0, setduty: 0 },
                    { value: false, pinNum:  2, gpioNum: 33, ledcChannel:  2, duty: 0, setduty: 0},
                    { value: false, pinNum:  3, gpioNum: 26, ledcChannel:  3, duty: 0, setduty: 0 },
                    { value: false, pinNum:  4, gpioNum: 27, ledcChannel:  4, duty: 0, setduty: 0 },
                    { value: false, pinNum:  5, gpioNum: 14, ledcChannel:  5, duty: 0, setduty: 0 },
                    { value: false, pinNum:  6, gpioNum: 12, ledcChannel:  6, duty: 0, setduty: 0 },
                    { value: false, pinNum:  7, gpioNum: 13, ledcChannel:  7, duty: 0, setduty: 0 },
                    { value: false, pinNum:  8, gpioNum: 15, ledcChannel:  8, duty: 0, setduty: 0 },
                    { value: false, pinNum:  9, gpioNum:  2, ledcChannel:  9, duty: 0, setduty: 0 },
                    { value: false, pinNum: 10, gpioNum:  5, ledcChannel: 10, duty: 0, setduty: 0 },
                    { value: false, pinNum: 11, gpioNum: 18, ledcChannel: 11, duty: 0, setduty: 0 },
                    { value: false, pinNum: 12, gpioNum: 19, ledcChannel: 12, duty: 0, setduty: 0 },
                    { value: false, pinNum: 13, gpioNum: 21, ledcChannel: 13, duty: 0, setduty: 0 },
                    { value: false, pinNum: 14, gpioNum: 22, ledcChannel: 14, duty: 0, setduty: 0 },
                    { value: false, pinNum: 15, gpioNum: 23, ledcChannel: 15, duty: 0, setduty: 0 }
                ]
            }
        },
        methods: {
            submit () {
                this.$bus.$emit(consts.EVENTS.UBUS_MESSAGE, 'espconfig-put', JSON.stringify({res: 1 * this.pwmresolution, freq: 1 * this.pwmFrequency}))
            },
            reset () {

            },
            setchannelparams (val) {
                this.$bus.$emit(consts.EVENTS.UBUS_MESSAGE, 'espconfig-setch', JSON.stringify({channel: 1 * val.ledcChannel, gpio: 1 * val.gpioNum, duty: 1 * val.duty}))
            }
        },
        watch: {
            pwmresolution: function (val) {
                this.maxFrequency = 80000000 / (1 << (1 * val));
                if (this.maxFrequency < this.pwmFrequency) {
                    this.pwmFrequency = this.maxFrequency;
                }
            },
            pwmFrequency: function (val) {
                if (this.maxFrequency < (1 * val)) {
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
