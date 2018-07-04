import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import router from './router';
import EventsBus from './core/bus.vue';
import storage from './core/storage';
import consts from './core/consts';
import mixins from './core/mixins';
import Apps from './core/applications';
import Root from './Root.vue';
import Axios from 'axios';

if(process.env.NODE_ENV === 'production') {
    console.info('%cSmartTank%c(c)', 'color: #1976d2; font-size: 40px;', 'color: #1976d2; font-size: 10px; vertical-align: top;');
    console.info('%cЕсли ты васько, сюда не ласько ;)', 'color: #1976d2; font-size: 16px;');
    console.info(process.env.BUILD_MOMENT);
}

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.mixin(mixins);

window.Vue = Vue;

let theBus  = new Vue(EventsBus);

Vue.prototype.$bus              = theBus;
Vue.prototype.$axios            = Axios;
Vuex.Store.prototype.$bus       = theBus;
window.Vue.$bus                 = theBus;
window.$store                   = new Vuex.Store(storage);
window.$bus                     = theBus;
window.$axios                   = Axios;
window.$consts                  = consts;
window.$exportComponent         = Apps.exportComponent;
window.$protocomponents         = [];   //
window.$resolvers_components    = [];
window.$getComponentBy          = Apps.getComponentBy;
window.$includeLang             = Apps.includeLang;
window.$requireComponent        = Apps.requireComponent;

//Loaded application components storage
window.$applications    = {};

Vue.config.productionTip = false;

//Multi Language
Vue.filter('lang', function (value) {

    let lang = window.$store.state.display.lang;
    let consts  = window.$consts;

    if(lang in consts.LANGS && value in consts.LANGS[lang])
        return consts.LANGS[lang][value];
    else {
        console.warn('Not found lang const ', value);
        return value;
    }
})

window.$store.dispatch('initData');

new Vue(Object.assign({
    el: '#app',
    router,
    store : window.$store,
}, Root));