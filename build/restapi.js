// Documentation of the server
// https://webpack.js.org/configuration/dev-server/#devserver-setup
'use strict'
const fs = require('fs')
const path = require('path')
var bodyParser = require('body-parser')

const virtual_state_data = path.join(__dirname, '/devstorage/state.json');

module.exports = function(app){

    app.use(bodyParser.json());

    let getActualState = function(){

        try {
            let state = JSON.parse(fs.readFileSync(virtual_state_data));

            //Time
            state.time    = {
                //Emulation current time of controller
                current : (new Date).getTime() - (new Date).getTimezoneOffset() * 60000,
                offset : state.time.offset
            };

            return state;

        } catch (e){

            console.log('No found state.json file', e);
            return null;

        }

    };

    app.get('/api/state', function(req, res) {

        console.log('>Get state data ');
        fs.readFile(virtual_state_data, (err, result) => {

            if (err) {
                console.log(err);
                res.send(404, 'Error of open state.json file');
            } else {

                let response = getActualState();

                if(!response)
                    res.send(500, "Can not read state.json file")
                else
                    res.json(getActualState());
            }
        });
    });

    app.get('/api/rescan_net', function(req, res) {

        console.log('>Get available access points list');
        fs.readFile(virtual_state_data, (err, result) => {
            if (err) {
                res.send(404, 'Error of open state.json file');
            } else
                res.json(JSON.parse(result).net.ap_list);
        });

    });

    app.get('/api/time', function(req, res) {

        console.log('>Get datetime');
        res.send(200, (new Date).getTime() - (new Date).getTimezoneOffset() * 60000);

    });

    app.put('/api/config', function(req, res) {


        try {

            let state = Object.assign(getActualState(), req.body);

            fs.writeFileSync(virtual_state_data, JSON.stringify(state));

            res.json(state);

        } catch (e) {
            console.log('Error write state.json file', e);
            res.send(500);
        }

    });


    app.put('/api/netconfig', function(req, res) {

        console.log('> Post store data: ', req.files.file.data.toString('ascii'));
        req.files.file.mv(virtual_state_data);
        res.status(200);
        res.end();

    });

}