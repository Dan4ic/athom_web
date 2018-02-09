import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import EventsBus from './core/bus.vue';
import storage from './core/storage';

Vue.use(Vuex);
Vue.use(Vuetify);

window.Vue = Vue;

let theBus  = new Vue(EventsBus);

Vue.prototype.$bus          = theBus;
Vuex.Store.prototype.$bus   = theBus;
window.Vue.$bus             = theBus;

window.$store   = new Vuex.Store(storage);
window.$bus     = theBus;

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store : window.$store,
    components: { App },
    template: '<App/>'
});

window.$store.dispatch('initData');

setTimeout(() => {
    window.$bus.$emit('application-loaded');
}, 50)
