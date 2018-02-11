// Documentation of the server
// https://webpack.js.org/configuration/dev-server/#devserver-setup
'use strict'
const fs = require('fs')
const path = require('path')

const virtual_state_data = path.join(__dirname, '/devstorage/state.json');
const virtual_aplist_data = path.join(__dirname, '/devstorage/apoints.json');

module.exports = function(app){

    app.get('/api/state', function(req, res) {

        console.log('>Get state data ');
        fs.readFile(virtual_state_data, (err, result) => {
            if (err) {
                console.log(err);
                res.send('');
            } else
                res.json(JSON.parse(result));
        });

    });

    app.get('/api/available_ap', function(req, res) {

        console.log('>Get available access points list');
        fs.readFile(virtual_aplist_data, (err, result) => {
            if (err) {
                res.json({});
            } else
                res.json(JSON.parse(result));
        });

    });

    app.get('/api/time', function(req, res) {

        console.log('>Get datetime');
        res.send(200, (new Date).getTime());

    });

    app.put('/api/netconfig', function(req, res) {

        console.log('> Post store data: ', req.files.file.data.toString('ascii'));
        req.files.file.mv(virtual_state_data);
        res.status(200);
        res.end();

    });

}