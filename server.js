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
// Initialize watcher.


// openvideocontroller(app, socket);



socket.on('connect', (socket) => {
    console.log(socket.id);
    console.log('user connected')


    socket.on('filename', (msg) => {
        console.log('Got the emitted file');
        var watcher = chokidar.watch(__dirname + '/screens/' + msg.filename, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        watcher

            .on('change', path => {
                console.log('😋');
                emitImageBuffer(socket)
            })

    })


    socket.on('disconnect', () => {
        console.log("socket disconnected");
    })
})



function emitImageBuffer(privateSocket) {
    fs.readFile(__dirname + '/screens/abcd.png', function (err, imgBuffer) {

        fs.readFile(__dirname + '/screens/abcd.png', (err, textBuffer) => {
            console.log(imgBuffer);
            console.log(textBuffer);
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

server.listen(port, () => {
    console.log("Server started on port" + port);
});
