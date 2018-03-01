export default {
    namespaced: true,
    state: {
        channels    : [
            {
                color   : '#ff0000',
            },
            {
                color   : '#00ff00',
            },
            {
                color   : '#0000ff',
            },
        ],            //Light channels array
        interval    : {
            width       : 864000,   //Total width of chart
            resolution  : 1800,     //Width of part of chart
            offset      : 0         //Offset of chart
        },
    },

    mutations: {

        //Update current hardware time after recalculation
        setIntervalWidth(state, width) {
            state.interval.width  = width;
        },

        //Update current hardware time after recalculation
        setChannelsParams(state, channels) {
            state.channels  = [];
            channels.map((channel) => {
                state.channels.push(Object.assign({}, channel));
            });
        },

    },

    actions: {

    }

}