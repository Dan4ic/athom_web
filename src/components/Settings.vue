<template>
  <v-container fill-width >
    <NetworkComponent></NetworkComponent>
    <DisplayComponent></DisplayComponent>
  </v-container>
</template>

<script>

import NetworkComponent from './settings/Network.vue';
import DisplayComponent from './settings/Display.vue';

export default {
  name: 'Settings',
  components : {
      NetworkComponent : NetworkComponent,
      DisplayComponent : DisplayComponent
  },
  methods : {
      submit(){
          alert("ok!");
      }
  },
  data () {
    return {
      valid : false,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
