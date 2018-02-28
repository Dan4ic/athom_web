export default {
    namespaced: true,
    state: {
        channels    : [
            {
                color   : '#f00',
            },
            {
                color   : '#0f0',
            },
            {
                color   : '#00f',
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
        setChannelsNumber(state, number) {

            if(+number < 1)
                number = 1;

            if(+number < state.channels.length)
                state.channels.slice(0, +number - 1);
            else (+number > state.channels.length)
                for(let f=state.channels.length; f < +number; f++)
                    state.channels.push({
                        color   : '#f0f',
                    });

        },

    },

    actions: {

    }

}