<template>
    <div class="desk">
        <lucerna-scheduller draggable="true"
                class="scheduler"
                :intervalWidth="interval.width"
                :channels="channels"
        ></lucerna-scheduller>
    </div>
</template>

<script>

    export default {
        name: 'Lucerna',
        computed : {
            interval(){
                let result = {
                    width : 86400
                };
                let config = this.$store.state.Lucerna.data.config;
                if(config && config.length)
                    result = config[0].interval;
                return result;
            },
            channels(){
                let config = this.$store.state.Lucerna.data.config;
                if(config && config.length)
                    config = config[0];
                else
                    return [
                        { color : '#FF0000' },
                        { color : '#00FF00' },
                        { color : '#0000FF' }
                    ]
                let result = [];
                for(let channel = 0; channel < config.channelNumber; channel++) {
                    result.push(
                        {
                            color : '#' + ('000000' + (+config.channels[channel]).toString(16)).slice(-6)
                        }
                    );
                }
                return result;
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
        /* border: 1px solid #f00; */
        /* min-height: 80vh; */
    }

    .scheduler {
        min-height: 350px;
        height: 100%;
        width: 100%;
    }

</style>
