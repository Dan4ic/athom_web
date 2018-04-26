<template>
    <v-form ref="form" lazy-validation>
        <v-card style="width: 100%">
            <v-card-title>
                <v-layout row>
                    <h1>{{'LEDC_PWM_VAL_TITLE' | lang}}</h1>
                </v-layout>
                <v-layout row :wrap="isMobileScreen">
                    <vue-slider v-for="item in ledcchannels"
                                v-model="item.value"
                                v-bind="slidersdata"
                                @callback="setchannelDuty(item)"
                    ></vue-slider>
                </v-layout>
            </v-card-title>
            <v-card-actions text-xs-right>
                <v-btn @click="submit">{{'SUBMIT' | lang }}</v-btn>
                <v-btn @click="reset" flat>{{'RESET' | lang }}</v-btn>
            </v-card-actions>
        </v-card>
        <v-card style="width: 100%">
            <v-card-title>
                <v-layout wrap column>
                    <h1>{{'FENIST_SENSORS_DATA_TITLE' | lang}}</h1>
                    <h5 v-for="sensor in owSensors">ID: {{sensor.owid}} Temperature: {{sensor.temperature}}&deg;C</h5>
                    <h5>Fan voltage: {{fan.voltage}} V</h5>
                    <h5>Fan tachometer: {{fan.tachometer}} RPM</h5>
                    <vue-slider v-model="fan.setlevel"
                                v-bind="fansliderdata"
                                @callback="fansetlevel()"
                    ></vue-slider>
                </v-layout>
            </v-card-title>
        </v-card>
    </v-form>
</template>

<script>
    /* eslint-disable indent */


    import template from './Template.vue'
    import vueSlider from './vue2-slider.vue'
    const consts = window.$consts
    export default {
        name: 'LedChannelsValues',
        extends: template,
        components: {
            vueSlider
        },
        computed: {
            lang: {
                get () {
                    return this.$store.state.display.lang;
                }
            }
        },
        methods: {
            submit () {
            },
            reset () {
            },
            setchannelDuty (val) {
                this.$bus.$emit(consts.EVENTS.UBUS_MESSAGE, 'espconfig-setduty', JSON.stringify({channel: 1 * val.channel, duty: 100 * val.value}));
            },
            fansetlevel () {
                this.$bus.$emit(consts.EVENTS.UBUS_MESSAGE, 'fan-setlevel', JSON.stringify({ fanlevel: 1 * this.fan.setlevel }));
            }
        },
        mounted () {
            this.$bus.$on(consts.EVENTS.UBUS_MESSAGE, (type, messages) => {
                let params = JSON.parse(messages);
                if (type === 'temperature-change') {
                    this.owSensors[params.number].temperature = params.temperature / 100;
                    this.owSensors[params.number].owid = params.owid;
                } else if (type === 'fan-v-change') {
                    this.fan.voltage = params.fanvoltage / 1000;
                } else if (type === 'tah-change') {
                    this.fan.tachometer = params.tachometer;
                }
            })
        },
        data () {
            return {
                owSensors: [{
                    owid: 0,
                    temperature: 0
                }],
                fan: {
                    setlevel: 0,
                    tachometer: 0,
                    voltage: 0
                },
                ledcchannels: [
                    {channel: 1, value: 0},
                    {channel: 2, value: 0},
                    {channel: 3, value: 0},
                    {channel: 4, value: 0},
                    {channel: 5, value: 0},
                    {channel: 6, value: 0},
                    {channel: 7, value: 0},
                    {channel: 8, value: 0},
                    {channel: 9, value: 0},
                    {channel: 10, value: 0},
                    {channel: 11, value: 0},
                    {channel: 12, value: 0},
                    {channel: 13, value: 0},
                    {channel: 14, value: 0},
                    {channel: 15, value: 0}
                ],
                slidersdata: {
                    width: 10,
                    height: 300,
                    dotSize: 22,
                    eventType: 'auto',
                    min: 0,
                    max: 100,
                    interval: 0.01,
                    disabled: false,
                    show: true,
                    tooltip: 'hover',
                    piecewise: false,
                    useKeyboard: true,
                    style: {
                        display: 'inline-block',
                        marginLeft: '30px'
                    },
                    direction: 'vertical',
                    speed: 0.5,
                    processStyle: {
                        backgroundColor: '#555'
                    }
                },
                fansliderdata: {
                    width: 300,
                    height: 10,
                    dotSize: 22,
                    eventType: 'auto',
                    min: 0,
                    max: 255,
                    interval: 1,
                    disabled: false,
                    show: true,
                    tooltip: 'hover',
                    piecewise: false,
                    useKeyboard: true,
                    style: {
                        display: 'inline-block',
                        marginLeft: '30px'
                    },
                    direction: 'horizontal',
                    speed: 0.5,
                    processStyle: {
                        backgroundColor: '#555'
                    }
                }
            }
        }
    }

</script>

<style scoped>

</style>
