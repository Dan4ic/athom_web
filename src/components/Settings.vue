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
    max-width: 29%;
    width: 100%;
    float: left;
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 4px;
  }

  @media screen and (max-width: 1300px) {
    .panel {
      max-width: 48%;
    }
  }


  @media screen and (max-width: 800px) {
    .panel {
      max-width: 100%;
      float: none;
      margin-left: 0px;
      margin-right: 0px;
      margin-bottom: 4px;
    }
  }

  @media screen and (max-width: 800px) {
    .panel {
      max-width: 100%;
      float: none;
      margin-left: -20px;
      margin-right: -10px;
      margin-bottom: 4px;
    }
  }

</style>
