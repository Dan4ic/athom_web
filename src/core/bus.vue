<template>
</template>

<script>

import consts from './consts'

export default {

    created(){
        this.$on(consts.EVENTS.UBUS_MESSAGE, (messages, distrib) => {
            if(!distrib || distrib != consts.WEBSOCKET.DISTRIB_MESSAGE_INTERNAL)
                this.websocket.send(messages);
        });

        this.$on(consts.EVENTS.WS_CLOSED, () => {
            setTimeout(()=> {
                this.startWebsocket();
            }, consts.WEBSOCKET.RECONNECT_TIMEOUT);
        });

        setTimeout(()=>{
            this.startWebsocket();
        }, 500);

    },
    methods : {
        startWebsocket(){
            if (!"WebSocket" in window){
                console.warn("WebSocket NOT supported by your Browser!");
                return false;
            }

            this.websocket = new WebSocket(consts.WEBSOCKET.ADDRESS);
            this.$emit(consts.EVENTS.WS_STARTING);

            this.websocket.onopen = () => {
                this.$emit(consts.EVENTS.WS_STARTED);
            };

            this.websocket.onmessage = (evt) => {
                this.$emit(consts.EVENTS.UBUS_MESSAGE, evt.data, consts.WEBSOCKET.DISTRIB_MESSAGE_INTERNAL);
            };

            this.websocket.onerror = () => {
                this.$emit(consts.EVENTS.WS_ERROR);
                this.$emit(consts.EVENTS.WS_CLOSED);
            };

            this.websocket.onclose = () => {
                this.$emit(consts.EVENTS.WS_CLOSED);

            };
        }
    },

    beforeDestroy(){
        if(this.websocket) {
            this.websocket.onerror  = () =>{};
            this.websocket.onclose = () =>{};
            this.websocket.close();
        }
    },

    data : {
        websocket   : null
    }

}
</script>
