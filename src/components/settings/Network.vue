<template>
  <v-form v-model="valid" ref="form" lazy-validation>
    <v-container fluid grid-list-md text-xs-left>
      <v-layout row wrap>
        <v-toolbar xs12>
          <v-toolbar-title>Network</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

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
          <v-layout row>
            <v-flex xs11 tile flat>
              <v-select
                      label="Access point"
                      v-model="sta_ssid"
                      :items="ap_list"
                      :rules="[v => !!v || 'Item is required']"
                      required
              ></v-select>
            </v-flex>
            <v-flex xs1>
              <v-btn icon @click="doRefreshAPList">
                <v-icon>refresh</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 text-xs-right>
          <v-btn @click="submit" :disabled="!valid">submit</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'SettingsNetwork',
  methods : {
      doRefreshAPList(){
          this.$store.dispatch('refreshAccessPointsList');
      },

      submit(){
          alert("ok!");
      }
  },
  computed : {
      ap_list(){

          let result  = [];
          this.$store.state.net.ap_available.map(function(item){
              result.push({
                  text : item.name
              });
          });

          return result;

      }
  },
  data () {
    return {
      valid : false,
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
