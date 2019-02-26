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

var msg = ""


var server = require('http').createServer(app);
var socket = require('socket.io')(server);

socket.on('connect', (io) => {
    console.log(io.id);
    console.log('user connected')

    io.on('filename', (msg) => {
        console.log('Got the emitted file ' + msg.filename);
        // io.join(parseInt(msg.filename));
    })
    io.on('disconnect', () => {
        io.leaveAll();
        console.log("socket disconnected");
    })
})


app.set('view engine', 'ejs');

const {PythonShell} = require('python-shell')
const {exec} = require('child_process')

const YOLO_DIR = './yolo/'
const INTERVAL = 1000

server.listen(port, () => {

    let pyOptions = {
        mode: 'text',
        pythonOptions: ['-u'],
        stdout: [],
        scriptPath: YOLO_DIR
    };

    // let pyshell = PythonShell.run('yolo_watcher.py', pyOptions, function(err) {
    //     if(err) { throw err; }
    // });
    console.log('Run yolo_watcher.py');
    let pyshell = PythonShell.run('yolo_watcher.py', pyOptions, function(err) {
        if(err) { throw err; }
    });


    pyshell.stdout.on('data', function(data) {
        console.log(data)
        msg = data
    });
    // Pass python error statements
    pyshell.on('stderr', function(stderr) {
        console.log(stderr)
    });

    // Pass Python print statements from stdout
    pyshell.on('message', function(message) {
        // console.log('Got print statement from pyshell')
        try { 
            var imgAndInfo = JSON.parse(message);
            socket.emit("json", message);
            // socket.in(imgAndInfo['index']).emit('image', {
            //     image: true, buffer: imgAndInfo['img64']
            // });
            // socket.emit('image', {
            //     image: true, buffer: imgAndInfo['img64']
            // });
        }catch(e) {
            console.log('Exceptipn ', e);
            console.log('***********ERROR JSON BEGIN **************')
            console.log(message)
            console.log('***********ERROR JSON END *****************')
        }
    });
    console.log("Server started on port" + port);
});