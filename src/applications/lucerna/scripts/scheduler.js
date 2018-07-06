let listener = ffi('void listener(void (*)(char*, char*, userdata), userdata)');
let emit = ffi('void emit(char*, char*)');
let log = ffi('void log(char*, char*, int)');
log('MJS', 'Starting Lucerna script...', 1);

/*
let rec_max = 0;
let record_num;
let start = $core.time();

let dots = $storage.open("dots");
function append(max) {
    let start = $core.time();
    let n;
    print(">>>> Started <<<<");
    for (n = 0; n < max; n++) {
        $storage.append(dots, {
            "brightness": n,
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
        print("Append ", n, " record");
    }
    print("Append ", n, " records spent ", $core.time() - start, " sec");
}

append(rec_max);

$storage.close(dots);
*/

function getConfig(){
    let config = $storage.open("config");
    let result = {
        interval : {
            width : 86400
        },
        channelNumber : 4,
        channels : {
            0  : 100000, 1  : 100000, 2  : 100000, 3  : 100000,
            4  : 100000, 5  : 100000, 6  : 100000, 7  : 100000,
            8  : 100000, 9  : 100000, 10 : 100000, 11 : 100000,
            12 : 100000, 13 : 100000, 14 : 100000, 15 : 100000,
        }
    };
    if($storage.first(config))
        result = $storage.get(config);
    $storage.close(config);
    return result;
}

let config = getConfig();

function getCurrentInterval(){
    let dots = $storage.open("dots");
    let time = $core.time() %
    for(let found = $storage.first(dots); found ; found = $storage.next(dots)){
        if()
        let dot = $storage.get(dots);
        print("Dot time=", dot.time, "brightness=", dot.brightness);
        ++record_num;
    }
    print("Total dots is ", record_num);
    $storage.close(dots);
}

function doInterval(){
    print("Calculating interval....");
    let interval = getCurrentInterval();
    print("Interval is ", interval.start, '<>', interval.stop);
}


listener(function(event, content, data) {
    print(">>> EVENT: ", event, ";", content, ";", data, "<<<");
    if(event === "$-storage-changed") {
        if((content === "Lucerna/dots") || (content === "Lucerna/config")) {
            doInterval();
        }
    }
}, null);

log('MJS', 'Lucerna script is stared.', 1);

/*

let update_start = $core.time();
record_num = 0;
for(let found = $storage.first(dots); found ; found = $storage.next(dots)){
    let dot = $storage.get(dots);
    if(record_num < (rec_max / 2)) {
        $storage.remove(dots);
    } else {
        dot.levels["9"] += 10;
        $storage.post(dots, dot);
    }
    ++record_num;
}
print("Updated ", record_num, " records. Spent ", $core.time() - update_start, " sec");

let shrink_start = $core.time();
$storage.shrink(dots);
print("Shrinked to ", $storage.size(dots), ". Spent ", $core.time() - shrink_start, " sec");

//append(rec_max);

let select_start = $core.time();
record_num = 0;
for(let found = $storage.first(dots); found; found = $storage.next(dots)){
    ++record_num;
    let dot = $storage.get(dots);
    //log('MJS', 'Record num ' + JSON.stringify(record_num) + ' dot.levels["9"] = ' + JSON.stringify(dot.levels["9"]), 1);
}
print("Selected ", record_num, " records. Spent ", $core.time() - select_start, " time file size ", $storage.size(dots));

$storage.close(dots);

print("Total work with storage ", $core.time() - start);

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
*/