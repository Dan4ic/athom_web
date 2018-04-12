let listener = ffi('void listener(void (*)(char *, char *, userdata), userdata)');
let log = ffi('void log(char *, char *, int)');
log('MJS', 'Started VMS', 1);
let test = "test variable";
listener(function(event, content, data) {
    if(event === "$-started"){
        ddffdf;
        log('MJS', 'STARTED!!!! test variable = ' + test, 1);   //Error info
    } else if(event === "$-script-error") {
        log('MJS', 'DETECT SCRIPT ERROR IN ' + content, 1);   //Error info
    } else {
        log('MJS', 'EVENT [' +event + "]:[" + content + "]", 1);   //Error info
    }
}, null);