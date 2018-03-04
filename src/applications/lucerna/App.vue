<template>
    <div class="desk">
        <lucerna-scheduller draggable="true"
                class="scheduler"
                :intervalWidth="interval.width"
        ></lucerna-scheduller>
    </div>
</template>

<script>

    export default {
        name: 'Lucerna2',
        methods : {
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

    .desk {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        padding : 8px;
    }

    .scheduler {
        min-height: 350px;
        height: 100%;
        width: 100%;
    }

</style>
