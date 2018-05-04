<template>
  <v-container style="display: flex; flex-direction: row; flex-wrap:wrap;">
      <DateTimeComponent class="panel" :style="panelStyle"></DateTimeComponent>
      <NetworkComponent class="panel" :style="panelStyle"></NetworkComponent>
      <DisplayComponent class="panel" :style="panelStyle"></DisplayComponent>
      <component
              v-for="(pref_comp_name) in customPrefs"
              class="panel"
              :is="pref_comp_name"
              :key="pref_comp_name"
              :style="panelStyle"
      ></component>
      <Applications class="panel" :style="panelStyle"></Applications>
      <Firmware class="panel" :style="panelStyle"></Firmware>
  </v-container>
</template>

<script>

import NetworkComponent from './settings/Network.vue';
import DisplayComponent from './settings/Display.vue';
import DateTimeComponent from './settings/DateTime.vue';
import Applications from './settings/Applications.vue';
import Firmware from './settings/Firmware.vue';
import consts from 'consts';

let PANEL_WIDTH     = 540;
let PANEL_PADDING   = 8;
let APP_PADDING     = 80;

export default {
  name: 'Settings',
  components : {
      NetworkComponent : NetworkComponent,
      DisplayComponent : DisplayComponent,
      DateTimeComponent : DateTimeComponent,
      Applications: Applications,
      Firmware : Firmware
  },
  computed:{
    customPrefs() {
        return $getComponentBy('smarttank.intent.category.PREFERENCE', 'smarttank.intent.action.MAIN');
    },
    panelStyle(){
        if(this.isMobileScreen)
            return {
                width : '100%'
            };
        else {
            this.recalcPanelSize();

            return {
                width   : this.panel_width + 'px'
            };
        }
    }
  },
  mounted(){
      this.$bus.$on(consts.EVENTS.DO_SCREEN_REBUILD, this.onResize);
  },
  methods : {
      recalcPanelSize(){

          let app_width = this.$el ? this.$el.offsetWidth - APP_PADDING
              :this.$vuetify.breakpoint.width
              - this.$vuetify.application.left
              - this.$vuetify.application.right
              - APP_PADDING;

          let col_count = Math.floor(app_width / (PANEL_WIDTH + PANEL_PADDING));
          if(col_count < 0)
              col_count   = 1;

          this.panel_width  = (app_width / col_count );

      },
      onResize(){
          this.recalcPanelSize();
      },
  },
  data () {
    return {
      valid : false,
      panel_width : 0,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .panel {
      display:flex;
    /* float: left; */
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 4px;
  }

</style>
