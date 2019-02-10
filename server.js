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
var socket = require('socket.io')(server);

socket.on('connect', (socket) => {
    console.log(socket.id);
    console.log('user connected')


    socket.on('filename', (msg) => {
        console.log('Got the emitted file ' + msg.filename);
        var watcher = chokidar.watch(__dirname + '/yolo/dat/' + msg.filename + '.dat', {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        watcher.on('change', path => {
            console.log('😋');
            emitImageBuffer(socket, msg.filename)
        })
    })
    socket.on('disconnect', () => {
        console.log("socket disconnected");
    })
})



function emitImageBuffer(privateSocket, filename) {
    console.log(filename);
    fs.readFile(__dirname + '/yolo/output/' + filename + '.jpg', function (err, imgBuffer) {

        fs.readFile(__dirname + '/yolo/output/' + filename + '.jpg', (err, textBuffer) => {
            console.log(imgBuffer);
            privateSocket.emit('image', {
                image: true, buffer: imgBuffer.toString('base64')
            });
            privateSocket.emit('text', {
                image: false, buffer: textBuffer
            });
        })

    });
}

app.set('view engine', 'ejs');

const {PythonShell} = require('python-shell')
const {exec} = require('child_process')

const YOLO_DIR = './yolo/'
const INTERVAL = 2000

server.listen(port, () => {
    // let pyOptions = {
    //     mode: 'text',
    //     pythonOptions: ['-u'],
    //     scriptPath: YOLO_DIR
    // };

    // let pyshell = PythonShell.run('yolo_watcher.py', pyOptions, function(err) {
    //     if(err) { throw err; }
    //     // console.log(results)
    // });

    // // Pass Python print statements from stdout
    // pyshell.on('message', function(message) {
    //     console.log(message);
    // });

    // // Init web scraper based on JSON config file
    // let cameras = require('./cameras.json')
    // cameras.forEach(function(element) {
    //     index = element.index
    //     url = element.url
    //     setInterval(scrape, INTERVAL, index, url)
    // });

    // function scrape(index, url) {
    //     let script = 'ffmpeg -y -i ' + url + ' ' + YOLO_DIR + 'input/' + 'location' + index + '.jpg'
    //     exec(script)
    // };
    console.log("Server started on port" + port);
});