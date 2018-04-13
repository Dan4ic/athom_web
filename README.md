# SmartTank 

> The project is web part of SmartTank opensource project.
> 

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

  - [Build Setup](#build-setup)
  - [System UBUS messages](#system-ubus-messages)
    - [WEB browser](#web-browser)
    - [Controller](#controller)
    - [Predefined system messages](#predefined-system-messages)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

```

## System UBUS messages
>UBUS is universal bus for communicate between different nodes. 
Any device can provide the role. Include WEB browser. When you send
message to the bus, all nodes receive it. Important - message will be
delivered when node is subscriber for this message. 

### WEB browser
``` javascript

 //Send message to UBUS with type "hello" and message "cargo"
 window.$bus.$emit(window.$consts.EVENTS.UBUS_MESSAGE, "hello", "cargo");
 
 //Receiving and showing message from UBUS
 window.$bus.$on(window.$consts.EVENTS.UBUS_MESSAGE, function(type, messages) {
    console.log(`${type}:${messages}`);
 });

```

### Controller
#### application manifest
``` json
  ...    
  "scripts" : {
    "subscriptions" : ["hello"],
    "entry" : "main",
    "modules" : {
      "main": {
        "source": "scripts/main.js",
        "optimize": false
      }
    }
  }
  ...    
```
#### application mjs script scripts/main.js
``` javascript

 //Importing UBUS listener function  
 let listener = ffi('void listener(void (*)(char*, char*, userdata), userdata)');
 
 //When message will received, function will call callback function  
 listener(function(event, content, data) {
    if(event === "hello"){
        print(event, ":", data);
    }
 }, null); 

 //Importing UBUS send function
 let emit = ffi('void emit(char*, char*)');    
 //Sending message to UBUS
 emit('my-script-ready', null);

```

### Predefined system messages
> All broadcast system messages is defined in **window.$const.UBUS**
#### Broadcast  
- **$-current-time** - (CURRENT_TIME) Contains epoch time (ms). Happens when the time is synchronized.
- **$-online** - (IS_ONLINE) No content. Happens when the controller connected to Internet.
- **$-offline** - (IS_OFFLINE) No content. Happens when the controller disconnected.
- **$-script-error** - (SCRIPT_ERROR) Contains error text. Happens when the script generates an error.

#### JavaScript
``` javascript
 window.$bus.$on(window.$consts.EVENTS.UBUS_MESSAGE, function(type, messages) {
    switch(type){
        case window.$consts.UBUS.CURRENT_TIME:
            console.log('Now is ', new Date(1 * messages));
            break;
        case window.$consts.UBUS.SCRIPT_ERROR:
            console.error('Script error: ', messages);
            break;
    }
 });
```

#### Specific massages for controller   
- **$-started** - No content. Happens when the controller starts or script installed.

#### mjs script
``` javascript
 let listener = ffi('void listener(void (*)(char*, char*, userdata), userdata)');
 listener(function(event, content, data) {
    if(event === "$-started"){
        print("Controller is ready!");       
    }
 }, null);
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
