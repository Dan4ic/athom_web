<template>
    <v-form ref="form" lazy-validation>
        <v-expansion-panel>
            <v-expansion-panel-content item = "1">
                <h1 slot="header">{{'ESP_LEDC_CONF_TITLE' | lang}}</h1>
                <v-card style="width: 100%">
                    <v-layout row>
                        <v-flex :xs12="isMobileScreen" :xs6="!isMobileScreen" class="col1">
                            <v-select
                                    :label="'PWM_RESOLUTION' | lang"
                                    v-model="pwmresolution"
                                    :items="pwmresolutions"
                                    class="col1"
                                    required
                            ></v-select>
                            <h6>10-15 bit</h6>
                        </v-flex>
                        <v-flex :xs12="isMobileScreen" :xs6="!isMobileScreen" class="col2">
                            <v-text-field
                                    v-model="pwmFrequency"
                                    :label="'PWM_FREQUENCY' | lang"
                                    type="number"
                                    min="1"
                                    :max="'maxFrequency'"
                                    required
                            ></v-text-field>
                            <h6>MAX:{{maxFrequency}}Hz</h6>
                        </v-flex>
                        <v-btn color="info">Info</v-btn>
                    </v-layout>
                </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content item = "2">
                <h1 slot="header">{{'ESP_LEDC_GPIO_TITLE' | lang}}</h1>
                <v-card>
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
                                required
                        ></v-text-field>
                    </v-flex>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
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
            }
        },
        data () {
            return {
                pwmresolutions : [ 10, 11, 12, 13, 14, 15 ],
                pwmFrequency : 2440,
                pwmresolution: 15,
                maxFrequency: 2440
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
