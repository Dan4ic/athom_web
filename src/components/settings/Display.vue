<template>
  <v-form ref="form" lazy-validation>
    <v-card>
      <v-card-title primary-title>
        <v-layout row wrap>
          <h1>Display</h1>
          <v-flex xs12>
            <v-select
                    label="Theme"
                    v-model="theme"
                    :items="themes"
                    required
            ></v-select>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-actions text-xs-right>
        <v-btn @click="submit">Submit</v-btn>
        <v-btn @click="submit">Reset</v-btn>
        <v-btn @click="submit">Default</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
export default {
  name: 'SettingsNetwork',
  computed : {
      theme : {
          get(){
              return this.$store.state.display.theme;
          },
          set(value){
              this.$store.commit('setTheme', value);
          }
      }
  },
  methods : {
      submit(){
      }
  },
  data () {
    return {
      themes : [
          { text: 'Dark', value : 'dark' },
          { text: 'Light', value : 'light'}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
