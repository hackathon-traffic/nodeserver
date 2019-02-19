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

socket.on('connect', (socket) => {
    console.log(socket.id);
    console.log('user connected')


    socket.on('filename', (msg) => {
        console.log('Got the emitted file ' + msg.filename);
        var watcher = chokidar.watch(__dirname + '/yolo/dat/' + msg.filename + '.json', {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        watcher.on('change', path => {
            // console.log('😋');
            emitImageBuffer(socket, msg.filename)
        })
    })
    socket.on('disconnect', () => {
        console.log("socket disconnected");
    })
})



function emitImageBuffer(privateSocket, filename) {
    // console.log(filename);
    
    fs.readFile(__dirname + '/yolo/output/' + filename + '.jpg',  function (err, imgBuffer) {

        fs.readFile(__dirname + '/yolo/dat/' + filename + '.json', (err, textBuffer) => {
            let text = textBuffer;
            privateSocket.emit('image', {
                image: true, buffer: imgBuffer.toString('base64')
            });
            privateSocket.emit('text', msg);
        });


    });
}

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
        // console.log("@@@@@@")
        msg = data
    });
    // Pass python error statements
    pyshell.on('stderr', function(stderr) {
        console.log(stderr)
    });

    // Pass Python print statements from stdout
    pyshell.on('message', function(message) {
        console.log(message);
    });

    // Init web scraper based on JSON config file
    // let cameras = require('./cameras.json')
    // var index = cameras[0].index;
    // var url = cameras[0].url;
    // setInterval(scrape, INTERVAL, index, url);
    // cameras.forEach(function(element) {
    //     index = element.index
    //     url = element.url
    //     setInterval(scrape, INTERVAL, index, url)
    // });
    var i = 0;
    function scrape(index, url) {
        let dir = YOLO_DIR + 'input/' + 'location' + index + '/';
        let script = 'ffmpeg -y -i ' + url + ' ' + dir + 'location' + i++ + '.jpg'
        exec(script)
    };
    console.log("Server started on port" + port);
});