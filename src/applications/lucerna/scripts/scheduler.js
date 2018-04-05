let listener = ffi('void listener(void (*)(char *))');
let log = ffi('void log(char *, char *, int)');
load('utils');
log('Started VMS' + utils.test(), 1);
listener(function(event){
    switch (event){
        case "start" :
            log('MJS', 'STARTED!!!!', 1);   //Error info
            break;
    }
})