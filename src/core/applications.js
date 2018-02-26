import consts from 'consts';

export default {
    exportComponent(component, object){
        window.$protocomponents[component]  = object;
    },

    makePromisLoadComponent(url, component){
        return function(resolve, reject) {
            if(component in window.$protocomponents) {
                resolve(window.$protocomponents[component]);
                return;
            }

            const script = document.createElement("script");
            script.src  = url;

            script.onload = () => {
                if(component in window.$protocomponents)
                    resolve(window.$protocomponents[component]);
                else {
                    window.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('ERROR_LOAD_APP'));
                    script.remove();
                    reject(new Error(Vue.filter('lang')('ERROR_LOAD_APP')));
                }
            };

            script.onerror = () => {
                window.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('ERROR_LOAD_APP'));
                reject(new Error("Failed to load module script with URL " + url));
                delete window[tempGlobal];
                script.remove();
            };

            document.documentElement.appendChild(script);
        }
    },

}