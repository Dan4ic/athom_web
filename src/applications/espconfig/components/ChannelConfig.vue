<template>
    <v-form ref="form" lazy-validation>
        <v-card style="width: 100%">
            <v-card-title>
                <v-layout row>
                    <h1>{{'LEDC_GPIO_TITLE' | lang}}</h1>
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
                        </template>
                        <template slot="pageText" slot-scope="props">
                            Items {{ props.pageStart }} - {{ props.pageStop }} from {{ props.itemsLength }}
                        </template>
                    </v-data-table>
                </v-layout>
            </v-card-title>
            <v-card-actions text-xs-right>
                <v-btn @click="submit">{{'SUBMIT' | lang }}</v-btn>
                <v-btn @click="reset" flat>{{'RESET' | lang }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>
const consts = window.$consts
export default {
  name: 'ChannelConfig',
  data () {
    return {
      ledcchannels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      gpioHeaders: [
        { text: 'Pin', value: 'pinNum', align: 'left', sortable: true },
        { text: 'GPIO', value: 'gpioNum', align: 'left', sortable: true },
        { text: 'Channel', value: 'ledcChannel' }
      ],
      gpioItems: [
        { value: false, pinNum: 1, gpioNum: 32, ledcChannel: 1},
        { value: false, pinNum: 2, gpioNum: 33, ledcChannel: 2},
        { value: false, pinNum: 3, gpioNum: 26, ledcChannel: 3},
        { value: false, pinNum: 4, gpioNum: 27, ledcChannel: 4},
        { value: false, pinNum: 5, gpioNum: 14, ledcChannel: 5},
        { value: false, pinNum: 6, gpioNum: 12, ledcChannel: 6},
        { value: false, pinNum: 7, gpioNum: 13, ledcChannel: 7},
        { value: false, pinNum: 8, gpioNum: 15, ledcChannel: 8},
        { value: false, pinNum: 9, gpioNum: 2, ledcChannel: 9},
        { value: false, pinNum: 10, gpioNum: 5, ledcChannel: 10},
        { value: false, pinNum: 11, gpioNum: 18, ledcChannel: 11},
        { value: false, pinNum: 12, gpioNum: 19, ledcChannel: 12},
        { value: false, pinNum: 13, gpioNum: 21, ledcChannel: 13},
        { value: false, pinNum: 14, gpioNum: 22, ledcChannel: 14},
        { value: false, pinNum: 15, gpioNum: 23, ledcChannel: 15}
      ]
    }
  },
  methods: {
    submit () {
      this.gpioItems.forEach(function (ch, i) {
        window.$bus.$emit(consts.EVENTS.UBUS_MESSAGE, 'espconfig-setchcfg', JSON.stringify({
          channel: 1 * ch.ledcChannel,
          gpio: 1 * ch.gpioNum
        }))
      })
    },
    reset () {
    }
  }
}
</script>

<style scoped>

</style>
