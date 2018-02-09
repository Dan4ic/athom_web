<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid grid-list-md text-xs-left>
      <v-layout row wrap>
        <v-toolbar xs12>
          <v-toolbar-title>Design</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-flex xs12>
          <v-select
                  label="Theme"
                  v-model="theme"
                  :items="themes"
                  required
          ></v-select>
        </v-flex>
        <v-flex xs12 text-xs-right>
          <v-btn @click="submit">Submit</v-btn>
          <v-btn @click="submit">Reset</v-btn>
          <v-btn @click="submit">Default</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
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
