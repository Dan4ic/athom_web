import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import EventsBus from './core/bus.vue';
import storage from './core/storage';

window.Vue = Vue;

let theBus  = new Vue(EventsBus);

Vue.prototype.$bus          = theBus;
Vuex.Store.prototype.$bus   = theBus;
window.Vue.$bus             = theBus;

Vue.use(Vuex);
Vue.use(Vuetify);

window.Vue      = Vue;
window.$store   = new Vuex.Store(storage);
window.$bus     = theBus;

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});


setTimeout(() => {
    window.$bus.$emit('application-loaded');
}, 50)
