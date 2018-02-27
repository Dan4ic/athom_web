import consts from 'consts';

export default {

    //Include application lang constants
    includeLang(consts){
        for(let lng in consts)
            Object.assign(window.$consts.LANGS[lng], consts[lng]);
    },

    //Return registered components by category or category & action
    getComponentBy(category, action){
        let result  = [];

        window.$store.state.apps.profiles.map(function(profile){
            for(let name in profile.components) {
                let component   = profile.components[name];
                if(component.intent_filter)
                    for(let f=0; f < component.intent_filter.length; f++){
                        if(
                            component.intent_filter[f].category
                            && category === component.intent_filter[f].category
                            && (
                                (!action
                                    || (
                                        component.intent_filter[f].action
                                        && action === component.intent_filter[f].action
                                    )
                                )
                            )
                        ) result.push(name);
                    }
            }
        });

        return result;
    },

    //Register pubic component
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