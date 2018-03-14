import consts from 'consts';

export default {

    //Create component by name
    requireComponent(name) {
        if (name in Vue.options.components)
            return new Promise(Vue.options.components[name]);
        else
            throw new Error(`Failed to create component ${name}`)
    },

    //Include application lang constants
    includeLang(consts) {
        for (let lng in consts)
            Object.assign(window.$consts.LANGS[lng], consts[lng]);
    },

    //Return registered components by category or category & action
    getComponentBy(category, action) {
        let result = [];

        window.$store.state.apps.profiles.map(function (profile) {
            for (let name in profile.components) {
                let component = profile.components[name];
                if (component.intent_filter)
                    for (let f = 0; f < component.intent_filter.length; f++) {
                        if (
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
    exportComponent(component, object) {
        if(component in window.$resolvers_components) {
            window.$resolvers_components[component].map((resolve) => {
                try {
                    resolve(object)
                } catch (e) {
                    console.error(e);
                    window.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('ERROR_LOAD_APP'));
                }
            });
            window.$resolvers_components[component] = [];
        }
    },

    //Create promise for dynamically load component
    makePromisLoadComponent(url, component) {
        return function (resolve, reject) {

            if (component in window.$protocomponents) {
                resolve(window.$protocomponents[component]);
                return;
            }

            if(component in window.$resolvers_components)
                window.$resolvers_components[component].push(resolve);
            else
                window.$resolvers_components[component] = [resolve];

            const script = document.createElement("script");
            script.src = url;

            script.onload = () => {
                /*
                if (component in window.$protocomponents)
                    resolve(window.$protocomponents[component]);
                else {
                    window.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('ERROR_LOAD_APP'));
                    script.remove();
                    reject(new Error(Vue.filter('lang')('ERROR_LOAD_APP')));
                }
                */
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