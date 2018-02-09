<template>
  <v-container fill-width >
      <NetworkComponent class="panel"></NetworkComponent>
      <DisplayComponent class="panel"></DisplayComponent>
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

  .panel {
    width: 29%;
    min-width: 400px;
    float: left;
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 4px;
  }

  @media (max-width: 1300px) {
    .panel {
      width: 48%;
    }
  }


  @media (max-width: 800px) {
    .panel {
      width: 100%;
      float: none;
      margin-left: 0px;
      margin-right: 0px;
      margin-bottom: 4px;
    }
  }

</style>
