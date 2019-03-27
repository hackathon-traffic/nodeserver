const port = 8080;

const path = require('path');
const express = require('express');
const controller = require('./controller.js');
const publicPath = path.join(__dirname + '/public');
var firebase = require('firebase');
var stream = require('stream');
const Multer = require('multer');
var stream = require('stream');

const {Storage} = require('@google-cloud/storage');
// Creates a client
const storage = new Storage({
  projectId: 'realtime-traffic-231501',
  keyFilename: "./realtime-traffic-231501-5a7240ffe516.json"
});



//for using http server instead of express server 
var app = express();
app.use(controller);
app.use('', controller);
app.use(express.static(publicPath));

var msg = ""


var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connect', (socket) => {
    console.log(socket.id);
    console.log('user connected')

    socket.on('filename', (msg) => {
        console.log('Got the emitted file ' + msg.filename);
        socket.leaveAll();
        socket.join(0);
    })
    socket.on('disconnect', () => {
        socket.leaveAll();
        console.log("socket disconnected");
    })
})


app.set('view engine', 'ejs');

const {PythonShell} = require('python-shell')
const {exec} = require('child_process')

const YOLO_DIR = './yolo/'
const INTERVAL = 1000

server.listen(port, () => {


    var cameraJson = require('./cameras.json');
    
    //Go through all cameras in json and start up equivalent amount of
    //Camera jsons
    
    let pyOptions = {
        mode: 'text',
        pythonOptions: ['-u'],
        stdout: [],
        scriptPath: YOLO_DIR,
        args: [JSON.stringify(cameraJson[1])]
    };
    console.log('Run yolo_watcher.py');
    let pyshell = PythonShell.run('yolo_watcher.py', pyOptions, function(err) {
        if(err) { throw err; }
    });
    // Pass Python print statements from stdout
    pyshell.on('message', function(message) {
        console.log(message) 
        var timestamp = Date.now();
        try { 
            // JSON.parse(message);
            // io.in(i).emit("json", message);
            if(message.charAt(0) == "{") {
                io.emit('json', message);
            }
            else {
                io.emit('img', { image: true, buffer: message});
                var bufferStream = new stream.PassThrough();
                bufferStream.end(Buffer.from(message, 'base64'));
                //Define bucket.
                var myBucket = storage.bucket('my-bucket');
                //Define file & file name.
                var file = myBucket.file(timestamp + '.jpg');
                //Pipe the 'bufferStream' into a 'file.createWriteStream' method.
            }
        }catch(e) {
            console.log('Exceptipn ', e);
            console.log('***********ERROR JSON BEGIN **************')
            console.log(message)
            console.log('***********ERROR JSON END *****************')
        }
    });

    // Pass python error statements
    pyshell.on('stderr', function(stderr) {
        console.log(stderr)
    });

    console.log("Server started on port" + port);
    
});