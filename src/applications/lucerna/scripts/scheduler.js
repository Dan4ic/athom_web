let listener = ffi('void listener(void (*)(char*, char*, userdata), userdata)');
let emit = ffi('void emit(char*, char*)');
let log = ffi('void log(char*, char*, int)');
log('MJS', 'Started VMS', 1);
let test = "test--print";

let dots = $storage.open("dots");
$storage.append(dots, {
    "brightness": 10,
    "levels": {
        "0": 10,
        "1": 20,
        "2": 30,
        "3": 40,
        "4": 50,
        "5": 60,
        "6": 70,
        "7": 80,
        "8": 90,
        "9": 100,
        "10": 90,
        "11": 80,
        "12": 70,
        "13": 60,
        "14": 50,
        "15": 40
    }
});

$storage.close(dots);

listener(function(event, content, data) {
    if(event === "$-started"){
        log('MJS', 'STARTED!!!! test variable = ' + test, 1);   //Error info
    } else if(event === "$-script-error") {
        log('MJS', 'DETECT SCRIPT ERROR IN ' + content, 1);   //Error info
    } else if(event === "lucerna-echo") {
        log('MJS', 'FOR MAX: ' + content, 1);   //Error info
        emit('lucerna-test', 'I recived:' + content);
    } else {
        log('MJS', 'EVENT [' +event + "]:[" + content + "]", 1);   //Error info
    }
}, null);