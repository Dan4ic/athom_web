/* eslint-disable indent */
let listener = ffi('void listener(void (*)(char *, char *, userdata), userdata)');
let log = ffi('void log(char *, char *, int)');
let ledc_setDutyToChannel = ffi ('int ledc_setDutyToChannel(int, int )');
let ledc_setChanneltoGPIO = ffi ('int ledc_setChanneltoGPIO(int, int )');
let ledc_setTimersConfig  = ffi ('int ledc_setTimersConfig(int, int )');
let tempc_setFanLevel  = ffi ('int tempc_setFanLevel(int)');
log('ESPC', 'Started', 1);
listener(function (event, content, data) {
    if(event === "espconfig-put"){
//        log('ESPC', 'DETECT EVENT = ' + content, 1);
        let params = JSON.parse(content);
        ledc_setTimersConfig(params.freq, params.res);
    } else if (event === "espconfig-setchcfg") {
//        log('ESPC', 'DETECT EVENT = ' + content, 1);
        let params = JSON.parse(content);
        ledc_setChanneltoGPIO(params.channel, params.gpio);
    } else if (event === "espconfig-setduty") {
//        log('ESPC', 'DETECT EVENT = ' + content, 1);
        let params = JSON.parse(content);
        ledc_setDutyToChannel(params.channel, params.duty);
    } else if (event === "fan-setlevel") {
//        log('ESPC', 'DETECT EVENT = ' + content, 1);
        let params = JSON.parse(content);
        tempc_setFanLevel(params.fanlevel);
    } else {
        log('ESPC', 'EVENT [' +event + "]:[" + content + "]", 1);   //Unknown events
    }
}, null);