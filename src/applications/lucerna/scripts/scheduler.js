let listener = ffi('void listener(void (*)(char*, char*, userdata), userdata)');
let emit = ffi('void emit(char*, char*)');
let log = ffi('void log(char*, char*, int)');
log('MJS', 'Started VMS', 1);
let test = "test--print";

let dots = $storage.open("dots");
function append() {
    for (let n = 0; n < 100; n++) {
        $storage.append(dots, {
            "brightness": n * 10,
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
    }
}

append();

for(let found = $storage.first(dots), index = 1; found ; found = $storage.next(dots)){
    if(index < 50) {
        $storage.remove(dots);
        log('MJS', 'Deleted record ' + JSON.stringify(index++), 1);
    } else {
        let dot = $storage.get(dots);
        dot.levels["9"] += 10;
        $storage.post(dots, dot);
        log('MJS', 'Updated record ' + JSON.stringify(index++), 1);
    }
}

append();

let record_num = 0;
for(let found = $storage.first(dots); found; found = $storage.next(dots)){
    ++record_num;
    log('MJS', 'Record num ' + JSON.stringify(record_num), 1);
    let dot = $storage.get(dots);
    print(dot.levels["9"]);
}
log('MJS', 'Total records ' + JSON.stringify(record_num) + " storage size = " + JSON.stringify($storage.size(dots)), 1);

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