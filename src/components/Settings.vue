<template>
  <v-container fill-width >
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
                    label="Name"
                    v-model="ap_ssid"
                    :rules="[v => !!v || 'Name of SSID is required']"
                    :counter="32"
                    required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
                    label="Password"
                    v-model="ap_password"
                    :counter="8"
                    required>
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-select
                    label="Item"
                    v-model="sta_list"
                    :items="items"
                    :rules="[v => !!v || 'Item is required']"
                    required
            ></v-select>
          </v-flex>
          <v-flex xs12>
            <v-btn @click="submit" :disabled="!valid">submit</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: 'Settings',
  methods : {
      submit(){
          alert("ok!");
      }
  },
  data () {
    return {
      sta_list : [
          "TEST1",
          "TEST2"
      ],
      ap_ssid : "",
      ap_password: "",
      sta_ssid : "",
      sta_password : ""
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
