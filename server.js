const port = 8080;

const path = require('path');
const express = require('express');
const controller = require('./controller.js');

//for using http server instead of express server 
var app = express();
app.use(controller);
app.use('', controller);

var server = require('http').createServer(app);
app.set('view engine', 'ejs');

const {PythonShell} = require('python-shell')
const {exec} = require('child_process')

const YOLO_DIR = './yolo/'
const INTERVAL = 2000

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

    // Init web scraper based on JSON config file
    let cameras = require('./cameras.json')
    cameras.forEach(function(element) {
        index = element.index
        url = element.url
        setInterval(scrape, INTERVAL, index, url)
    });

    function scrape(index, url) {
        let script = 'ffmpeg -y -i ' + url + ' ' + YOLO_DIR + 'input/' + 'location' + index + '.jpg'
        exec(script)
    };

    console.log("Server started on port" + port);
});
