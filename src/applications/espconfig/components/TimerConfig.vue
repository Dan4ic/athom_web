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
import template from './Template.vue'
const consts = window.$consts
export default {
  name: 'TimerConfig',
  extends: template,
  data () {
    return {
      pwmresolutions: [ 10, 11, 12, 13, 14, 15 ],
      pwmFrequency: 2440,
      pwmresolution: 15,
      maxFrequency: 2440
    }
  },
  methods: {
    submit () {
        window.$bus.$emit(consts.EVENTS.UBUS_MESSAGE, 'espconfig-put', JSON.stringify({res: 1 * this.pwmresolution, freq: 1 * this.pwmFrequency}))
    },
    reset () {
    }
  },
  watch: {
    pwmresolution: function (val) {
      this.maxFrequency = 80000000 / (1 << (1 * val))
      if (this.maxFrequency < this.pwmFrequency) {
        this.pwmFrequency = this.maxFrequency
      }
    },
    pwmFrequency: function (val) {
      if (this.maxFrequency < (1 * val)) {
        this.pwmFrequency = this.maxFrequency
      }
    }
  }
}
</script>

<style scoped>

    .col1 {
        padding-right: 4px;
    }

    .col2 {
        padding-left: 4px;
    }

</style>
