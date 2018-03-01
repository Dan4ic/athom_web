<template>
    <div style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; padding: 8px;">
    <lucerna-scheduller
            class="scheduler"
            :intervalWidth="interval.width"
    ></lucerna-scheduller>
    </div>
</template>

<script>

    export default {
        name: 'Lucerna2',
        mounted(){
            console.log('Mounted application');
        },
        beforeDestroy () {
            console.log('Destroy application');
        },
        computed : {
            interval(){
                return this.$store.state.lucerna.interval;
            }
        },
        data() {
            return {
                message : $consts.WEBSOCKET.ADDRESS
            }
        }
    }
</script>

<style>

    .scheduler {
        min-height: 5cm;
        height: 100%;
        max-width: 100%;
    }

</style>
