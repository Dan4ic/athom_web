export default {
    namespaced: true,
    state: {
        interval    : {
            width       : 864000,
            resolution  : 1800,
            offset      : 0     //Смещение графика слева
        },
    },

    mutations: {

        //Update current hardware time after recalculation
        setIntervalWidth(state, width) {
            state.interval.width  = width;
        },

    },

    actions: {

    }

}