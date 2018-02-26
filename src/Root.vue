<template>
    <div>
        <launcher v-if="isAppReady" />
        <div
                v-else
                style="position: fixed; top: 0; left: 0; bottom: 0; right: 0; background-color: #fff; z-index: 10000;"
        >
            <v-progress-circular
                    indeterminate
                    :size="80"
                    color="primary"
                    style="margin-left: -40px; margin-top: -40px; left: 50%; top: 50%; position: fixed;"
            ></v-progress-circular>
        </div>
    </div>
</template>

<script>

    import consts from 'consts';

    export default {
        name: 'SmartTankCore',
        mounted(){
            setTimeout(() => {
                window.$bus.$emit(consts.EVENTS.CORE_IS_LOADED);
            }, 50);
        },
        computed : {
          isAppReady(){
              return !!this.$store.state.apps.profiles;
          }
        }
    }
</script>

<style>
    @import './assets/material_icons.css';
    @import '../node_modules/vuetify/dist/vuetify.min.css';
</style>
