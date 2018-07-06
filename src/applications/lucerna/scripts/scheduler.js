let listener = ffi('void listener(void (*)(char*, char*, userdata), userdata)');
let emit = ffi('void emit(char*, char*)');
let log = ffi('void log(char*, char*, int)');
log('MJS', 'Starting Lucerna script...', 1);

function getConfig(){
    let config = $storage.open("config");
    let result = {
        "interval" : {
            "width" : 86400
        },
        "channelNumber" : 4,
        "channels" : {
            "0"  : 100000, "1"  : 100000, "2"  : 100000, "3"  : 100000,
            "4"  : 100000, "5"  : 100000, "6"  : 100000, "7"  : 100000,
            "8"  : 100000, "9"  : 100000, "10" : 100000, "11" : 100000,
            "12" : 100000, "13" : 100000, "14" : 100000, "15" : 100000,
        }
    };
    if($storage.first(config))
        result = $storage.get(config);
    $storage.close(config);
    return result;
}

let config = getConfig();

function getCurrentInterval(){
    let time = $core.time() % config.interval.width;
    let prev_dot = null;
    let next_dot = null;
    let rec_scanned = 0;

    print('Current time is ', time);

    let dots = $storage.open("dots");
    for(let found = $storage.first(dots); found ; found = $storage.next(dots)){
        let dot = $storage.get(dots);
        if(dot.time < time) {
            prev_dot = dot;
        } else {
            break;
        }
        print("Dot time=", dot.time, "brightness=", dot.brightness);
        ++rec_scanned;
    }

    $storage.close(dots);
    print("Records scanned ", rec_scanned);

    if(prev_dot) {
        if($storage.next(dots)) {
            next_dot = $storage.get(dots);
        } else if($storage.first(dots)) {
            next_dot = prev_dot;
            prev_dot = $storage.get(dots);
        }
        print("Prev dot time=", prev_dot.time, " next dot time=", next_dot.time);
        return {
            start : prev_dot,
            stop : next_dot
        };
    }

    print("No first dot :(");
    return null;
}

function doInterval(){
    print("Calculating interval....");
    let interval = getCurrentInterval();
    if(interval) {
        print("Interval is ", interval.start, '<>', interval.stop);
    } else {
        print("No interval");
    }
}

doInterval();

listener(function(event, content, data) {
    print(">>> EVENT: ", event, ";", content, ";", data, "<<<");
    if(event === "$-storage-changed") {
        if((content === "Lucerna/dots") || (content === "Lucerna/config")) {
            doInterval();
        }
    }
}, null);

log('MJS', 'Lucerna script is stared.', 1);