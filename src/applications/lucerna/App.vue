<template>
    <div>
    <lucerna-scheduller
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

</style>
