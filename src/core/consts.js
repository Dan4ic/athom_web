export default {
    WEBSOCKET : {
        ADDRESS : "ws://192.168.1.96:80",
        RECONNECT_TIMEOUT : 5000,
        DISTRIB_MESSAGE_INTERNAL : 'internal',
    },
    UBUS : {
        CURRENT_TIME : '$-current-time',
        IS_ONLINE : '$-online',
        IS_OFFLINE : '$-offline',
        SCRIPT_ERROR : '$-script-error',
    },
    EVENTS : {
        CORE_IS_LOADED : 'core-loaded',
        LAUNCHER_IS_LOADED : 'launcher-loaded',
        DO_SCREEN_REBUILD : 'do-screen-rebuild',
        PUT_CONFIG_ERROR : 'put-config-error',
        PUT_CONFIG_SUCCESS : 'put-config-success',
        ALERT: 'alert',
        WS_STARTING : 'ws-starting',
        WS_STARTED : 'ws-started',
        WS_ERROR : 'ws-error',
        WS_CLOSED : 'ws-closed',
        UBUS_MESSAGE : 'ubus-message',
    },
    ALERT_TYPE :{
        ERROR : 'error',
        SUCCESS : 'success',
        INFO : 'info',
    },
    REST : {
        STATE : "/api/state",
        PROFILE : "/manifest",
        CONFIG : "/api/config",
        AP_AVAILABLE : "/api/rescan_net",
        TIME : "/api/time",
    },
    LANGS : {

    }
}