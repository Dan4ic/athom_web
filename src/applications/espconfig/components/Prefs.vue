<template>
    <v-container style="display: flex; flex-direction: row; flex-wrap:wrap;">
        <channel-config class="panel" :style="panelStyle"></channel-config>
        <timer-config class="panel" :style="panelStyle"></timer-config>
    </v-container>
</template>

<script>
    /* eslint-disable indent */
    import ChannelConfig from "./ChannelConfig";
    import TimerConfig from "./TimerConfig";
    let PANEL_WIDTH     = 540;
    let PANEL_PADDING   = 8;
    let APP_PADDING     = 80;
    const consts = window.$consts;
    export default {
        name: 'ESPConfigPrefs',
        components: {TimerConfig, ChannelConfig},
        computed: {
            panelStyle () {
                if(this.isMobileScreen)
                    return {
                        width: '100%'
                    };
                else {
                    this.recalcPanelSize();

                    return {
                        width: this.panel_width + 'px'
                    };
                }
            }
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
