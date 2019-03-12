const port = 8080;

const path = require('path');
const express = require('express');
const controller = require('./controller.js');
const publicPath = path.join(__dirname + '/public');

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
    
    var i;
    for (i = 0; i < 1; i++) { 
        let pyOptions = {
            mode: 'text',
            pythonOptions: ['-u'],
            stdout: [],
            scriptPath: YOLO_DIR,
            args: [JSON.stringify(cameraJson[i])]
        };
        console.log('Run yolo_watcher.py');
        let pyshell = PythonShell.run('yolo_watcher.py', pyOptions, function(err) {
            if(err) { throw err; }
        });
        // Pass Python print statements from stdout
        pyshell.on('message', function(message) {
            console.log(message)
            try { 
                JSON.parse(message);
                io.in(i).emit("json", message);
                // io.emit("json", message);
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
    }

    console.log("Server started on port" + port);

    return;




    // let pyshell = PythonShell.run('yolo_watcher.py', pyOptions, function(err) {
    //     if(err) { throw err; }
    // });
    console.log('Run yolo_watcher.py');
    let pyshell = PythonShell.run('yolo_watcher.py', pyOptions, function(err) {
        if(err) { throw err; }
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
});