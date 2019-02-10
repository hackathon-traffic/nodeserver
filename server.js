const port = 8080;

const path = require('path');
const express = require('express');
const controller = require('./controller.js');
const publicPath = path.join(__dirname + '/public');
const fs = require('fs');
const chokidar = require('chokidar');
const openvideocontroller = require('./openvideocontroller.js');

//for using http server instead of express server 
var app = express();
app.use(controller);
app.use('', controller);
app.use(express.static(publicPath));


var server = require('http').createServer(app);
app.set('view engine', 'ejs');

const {PythonShell} = require('python-shell')
const {exec} = require('child_process')

const YOLO_DIR = './yolo/'
const INTERVAL = 5000

server.listen(port, () => {
    let pyOptions = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: YOLO_DIR
    };

    let pyshell = PythonShell.run('yolo_watcher.py', pyOptions, function(err) {
        if(err) { throw err; }
        console.log(results)
    });

    // Pass Python print statements from stdout
    pyshell.on('message', function(message) {
        console.log(message);
    });

    setInterval(scrape, INTERVAL, 1, 'rtmp://wzmedia.dot.ca.gov:1935/D4/W80_at_Carlson_Blvd_OFR.stream');
    setInterval(scrape, INTERVAL, 2, 'rtmp://wzmedia.dot.ca.gov:1935/D4/E580_Lower_Deck_Pier_16.stream');
    setInterval(scrape, INTERVAL, 3, 'rtmp://wzmedia.dot.ca.gov:1935/D4/S101_at_Airport_Bl.stream');
    setInterval(scrape, INTERVAL, 4, 'rtmp://wzmedia.dot.ca.gov/D4/W80_at_Ashby.stream');
    
    function scrape(index, url) {
        let script = 'ffmpeg -y -i ' + url + ' ' + YOLO_DIR + 'input/' + 'location' + index + '.jpg'
        exec(script)
    };

    console.log("Server started on port" + port);
});
