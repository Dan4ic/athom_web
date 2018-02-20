import consts from 'consts';

export default {
    registerApplication(appname, object){
        window.$applications[appname]   = object;
    },
    loadApplication(appname) {
        return new Promise((resolve, reject) => {

            if(appname in window.$applications) {
                resolve(window.$applications[appname]);
                return;
            }

            const script = document.createElement("script");
            const tempGlobal = "__tempModuleLoadingVariable" + Math.random().toString(32).substring(2);
            let url = `http://localhost:8080/${appname}.js`;
            script.src  = `http://localhost:8080/${appname}.js`;

            script.onload = () => {
                if(appname in window.$applications)
                    resolve(window.$applications[appname]);
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
        })
    }
}