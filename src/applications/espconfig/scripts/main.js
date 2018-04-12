let listener = ffi('void listener(void (*)(char *, char *, userdata), userdata)');
let log = ffi('void log(char *, char *, int)');
let ledc_setDutyToChannel = ffi('int ledc_setDutyToChannel(int, int )');
log('ESPC', 'Started', 1);
ledc_setDutyToChannel(0, 5000);
listener(function(event, content, data) {
    if(event === "espconfig-put"){
        log('ESPC', 'DETECT EVENT = ', content, 1);
        let params = JSON.parse(content);
        ledc_setDutyToChannel(params.p1, params.p2);
    } else {
        log('ESPC', 'EVENT [' +event + "]:[" + content + "]", 1);   //Unknown events
    }
}, null);