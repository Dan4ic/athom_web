<template>
</template>

<script>

import consts from './consts'

export default {
    created(){
        this.$on(consts.EVENTS.UBUS_MESSAGE, (action, messages, distrib) => {
            if(!distrib || distrib != consts.WEBSOCKET.DISTRIB_MESSAGE_INTERNAL)
                this.websocket.send(`${action};${messages}`);
        });

        setInterval(()=>{
            if(!this.websocket) //IS CLOSED
                this.startWebsocket();
        }, 1000);

        setTimeout(()=>{
            this.startWebsocket();
        }, 500);

    },
    methods : {
        startWebsocket(){
            //todo disabled websocket
            if(process.env.NODE_ENV !== 'production')
                return;

            if (!"WebSocket" in window){
                console.warn("WebSocket NOT supported by your Browser!");
                return false;
            }

            if(!this.websocket)
                this.websocket = new WebSocket('ws://' + window.location.hostname + ':8080');

            this.$emit(consts.EVENTS.WS_STARTING);

            this.websocket.onopen = () => {
                this.$emit(consts.EVENTS.WS_STARTED);
            };

            this.websocket.onmessage = (evt) => {
                let struct  = evt.data.split(';');
                this.$emit(consts.EVENTS.UBUS_MESSAGE, struct[0], struct[1], consts.WEBSOCKET.DISTRIB_MESSAGE_INTERNAL);
            };

            this.websocket.onerror = () => {
                try {
                    let ws  = this.websocket;
                    this.websocket  = null;
                    ws.close();
                } catch(e){
                }
                this.$emit(consts.EVENTS.WS_ERROR);
                this.$emit(consts.EVENTS.WS_CLOSED);
            };

            this.websocket.onclose = () => {
                this.$emit(consts.EVENTS.WS_CLOSED);
                this.websocket  = null;
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
