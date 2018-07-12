let listener = ffi('void listener(void (*)(char*, char*, userdata), userdata)');
let emit = ffi('void emit(char*, char*)');
let log = ffi('void log(char*, char*, int)');
log('MJS', 'Starting Lucerna script...', 1);

let ledc_setDutyFadeToChannel = ffi('int ledc_setDutyFadeToChannel(int, int, int)');

let channels_ids = [
    "0", "1", "2",  "3",  "4",  "5",  "6",  "7",
    "8", "9", "10", "11", "12", "13", "14", "15"
];

let def_level = 10000;

function getConfig(){
    let config = $storage.open("config");
    let result = {
        "interval" : {
            "width" : 86400
        },
        "channelNumber" : 4,
        "channels" : {}
    };
    for(let f = 0; f < channels_ids.length; f++){
        result.channels[channels_ids[f]] = def_level;
    }

    if($storage.first(config))
        result = $storage.get(config);
    $storage.close(config);

    print("Interval=", result.interval.width, " channelNumber=", result.channelNumber);
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
        print("#", rec_scanned++, "Dot time=", dot.time, "brightness=", dot.brightness);
        if(dot.time < time) {
            prev_dot = dot;
        } else {
            next_dot = dot;
            break;
        }
    }

    print("Records scanned ", rec_scanned);

    if(prev_dot && !next_dot) {
        print("Next dot is first dot");
        $storage.first(dots);
        next_dot = $storage.get(dots);
    } else if(next_dot && !prev_dot) {
        print("First dot is last dot");
        $storage.last(dots);
        prev_dot = $storage.get(dots);
    }

    $storage.close(dots);

    return !prev_dot ? null : {
        time : time,
        start : prev_dot,
        stop : next_dot
    };
}

function abs(r){
    return r < 0 ? -r : r;
}

function calcTransition(border, dot1, dot2){
    let leftShoulder = border - (dot1.time < dot2.time ? dot1.time : dot2.time);
    let width = abs(dot1.time - dot2.time);
    let koof = leftShoulder / width;

    let result = {
        brightness : abs(dot1.brightness - (dot1.brightness - dot2.brightness) * koof)
    };

    print("Border=", border, " dot1.brightness=", dot1.brightness, " dot2.brightness=", dot2.brightness, " avg=", result.brightness);
    print("Spectrum :");
    for(let f = 0; f < channels_ids.length; f++) {
        let channel = channels_ids[f];
        result[channel] =  abs(
            dot1.spectrum[channel]
            - (dot1.spectrum[channel] - dot2.spectrum[channel])
            * koof
        );
        print(" #", channel, "=", result[channel]);
    }

    return result;
}

function restartExecution(){
    let interval = getCurrentInterval();
    if(interval) {
        print("Interval is ", interval.start.time, '<>', interval.stop.time);
        calcTransition(interval.time, interval.start, interval.stop);
        for(let f = 0; f < channels_ids.length; f++) {
            let channel = channels_ids[f];
            print("     level for channel ", channel, " is ", interval.start.spectrum[channel]);
        }
    } else {
        print("No interval");
    }
}

function nextExecution(){
}

restartExecution();

listener(function(event, content, data) {
    print(">>> EVENT: ", event, ";", content, ";", data, "<<<");
    if(event === "$-storage-changed") {
        if(content === "Lucerna/config") {
            config = getConfig();
            restartExecution();
        } else if(content === "Lucerna/dots") {
            restartExecution();
        }
    }
}, null);

log('MJS', 'Lucerna script is stared.', 1);