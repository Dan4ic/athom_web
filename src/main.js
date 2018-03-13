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

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.mixin(mixins);

window.Vue = Vue;

let theBus  = new Vue(EventsBus);

Vue.prototype.$bus          = theBus;
Vuex.Store.prototype.$bus   = theBus;
window.Vue.$bus             = theBus;
window.$store               = new Vuex.Store(storage);
window.$bus                 = theBus;
window.$consts              = consts;
window.$exportComponent     = Apps.exportComponent;
window.$protocomponents     = [];
window.$getComponentBy      = Apps.getComponentBy;
window.$includeLang         = Apps.includeLang;
window.$requireComponent    = Apps.requireComponent;

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