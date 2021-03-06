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
        //todo если включить debugger вываливается ошибка interval
        //debugger;
        console.info(consts);
        for (let lng in consts) {
            if(!window.$consts.LANGS[lng])
                window.$consts.LANGS[lng]   = {};
            Object.assign(window.$consts.LANGS[lng], consts[lng]);
        }
        console.info(window.$consts.LANGS);
    },

    //Return registered components by category or category & action
    getComponentBy(category, action) {
        let result = [];

        for(let appid in window.$store.state.apps.profiles) {
            let profile = window.$store.state.apps.profiles[appid];
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
        };

        return result;
    },

    //Register pubic component
    exportComponent(component, object) {
        if(component in window.$resolvers_components) {
            window.$resolvers_components[component].map((resolve) => {
                try {
                    console.log(`Resolved for ${component}`);
                    resolve(object)
                } catch (e) {
                    console.error(e);
                    window.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('ERROR_LOAD_APP'));
                }
            });
            window.$resolvers_components[component] = [];
        }
        window.$protocomponents[component]  = object;
    },

    //Create promise for dynamically load component
    makePromisLoadComponent(url, component) {
        return function (resolve, reject) {

            let doLoadComponent = (attempt) => {

                if (component in window.$protocomponents) {
                    resolve(window.$protocomponents[component]);
                    return;
                }

                if(component in window.$resolvers_components) {
                    window.$resolvers_components[component].push(resolve);
                    return;
                } else
                    window.$resolvers_components[component] = [resolve];

                const script = document.createElement("script");
                script.src = url;

                script.onload = () => {
                    window.$store.commit('decNetPending');
                    console.info(`Loaded component ${component}`);

                    //Is loaded launcher?
                    if(component==='launcher')
                        window.$bus.$emit(consts.EVENTS.LAUNCHER_IS_LOADED);

                };

                script.onerror = () => {
                    script.remove();

                    if(attempt-- > 0)
                        doLoadComponent(attempt)
                    else {
                        console.info(`Error load component ${component}`);
                        window.$store.commit('decNetPending');
                        window.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('ERROR_LOAD_APP'));
                        reject(new Error("Failed to load module script with URL " + url));
                    }
                };

                window.$store.commit('incNetPending');
                document.documentElement.appendChild(script);
            }

            doLoadComponent(5);
        }
    },

}