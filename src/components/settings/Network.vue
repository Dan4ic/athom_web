<template>
  <v-form v-model="valid" ref="form" lazy-validation>
    <v-card>
      <v-card-title primary-title>
        <v-layout row wrap>
          <h1>{{'ACCESS_POINT' | lang }}</h1>
          <v-flex xs12>
            <v-text-field
                    :label="'NAME' | lang "
                    v-model="ap_ssid"
                    :rules="[v => !!v || 'Name of SSID is required']"
                    :counter="32"
                    required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
                    :label="'PASSWORD' | lang "
                    v-model="ap_password"
                    :counter="32"
                    required>
            </v-text-field>
          </v-flex>
          <h1>{{'INTERNET_CONNECTION' | lang }}</h1>
          <v-flex xs12>
            <v-layout row>
              <v-flex xs11 tile flat>
                <v-select
                        :label="'ACCESS_POINT' | lang"
                        v-model="sta_ssid"
                        :items="ap_list"
                        :rules="[v => !!v || 'Item is required']"
                        required
                ></v-select>
              </v-flex>
              <v-flex xs1 style="padding-top: 12px;">
                <v-btn icon @click="doRefreshAPList">
                  <v-icon>refresh</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex xs12>
              <v-text-field
                      :label="'PASSWORD' | lang "
                      v-model="sta_password"
                      :counter="32"
                      required>
              </v-text-field>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-actions text-xs-right>
        <v-btn @click="submit" :disabled="!valid">{{'SUBMIT' | lang}}</v-btn>
      </v-card-actions>
    </v-card>
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
