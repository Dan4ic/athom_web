<template>
  <v-container>
      <DateTimeComponent class="panel" :style="panelStyle"></DateTimeComponent>
      <NetworkComponent class="panel" :style="panelStyle"></NetworkComponent>
      <DisplayComponent class="panel" :style="panelStyle"></DisplayComponent>
  </v-container>
</template>

<script>

import NetworkComponent from './settings/Network.vue';
import DisplayComponent from './settings/Display.vue';
import DateTimeComponent from './settings/DateTime.vue';
import consts from './../core/consts';

let PANEL_WIDTH     = 540;
let PANEL_PADDING   = 8;
let APP_PADDING     = 80;

export default {
  name: 'Settings',
  components : {
      NetworkComponent : NetworkComponent,
      DisplayComponent : DisplayComponent,
      DateTimeComponent : DateTimeComponent
  },
  computed:{
    panelStyle: function(){
        if(this.isMobileScreen)
            return {
                width : '100%'
            };
        else {

            this.recalcPanelSize();

            console.log('Panel width=', this.panel_width);

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

          console.log(app_width);

          let col_count = Math.floor(app_width / (PANEL_WIDTH + PANEL_PADDING));
          if(col_count < 0)
              col_count   = 1;

          this.panel_width  = (app_width / col_count );

      },

      onResize(){
          this.recalcPanelSize();
      },
      submit(){
          alert("ok!");
      }
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
    float: left;
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 4px;
  }

</style>
