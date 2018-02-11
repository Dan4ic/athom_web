export default {
    computed :{

        //Return datetime of controller
        hwDateTime: function () {
           
            return new Date(this.$store.state.datetime.curr_datetime);

        }

    }
}