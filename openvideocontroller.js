const chokidar = require('chokidar');
const express = require('express');
var watcher;

// module.exports = function (app, socket) {
//     socket.on('connect', (socket) => {



//         console.log('connected');
//     })

//     socket.on('watchfile', (message) => {
//         console.log(message.msg);
//         //     watcher = chokidar.watch(__dirname + '/screens/abcd.txt', {
//         //         ignored: /(^|[\/\\])\../,
//         //         persistent: true
//         //     });
//         //     watcher
//         //         .on('add', path => {
//         //             console.log('added');
//         //             emitImageBuffer(socket)
//         //         })
//         //         .on('change', path => {
//         //             console.log('cheanged');
//         //             emitImageBuffer(socket)
//         //         })
//         //         .on('unlink', path => {
//         //             console.log('unlink');
//         //             emitImageBuffer(socket)
//         //         });
//         // })
//     })
//     socket.on('disconnect', () => {
//         console.log("socket disconnected");
//     })


//     function emitImageBuffer(privateSocket) {
//         fs.readFile(__dirname + '/screens/abcd.png', function (err, imgBuffer) {

//             fs.readFile(__dirname + '/screens/abcd.png', (err, textBuffer) => {
//                 privateSocket.emit('image', {
//                     image: true, buffer: imgBuffer.toString('base64')
//                 });
//                 privateSocket.emit('text', {
//                     image: false, buffer: textBuffer
//                 });
//             })

//         });
//     }

//     app.get('/getinfo/:video', (req, res) => {
//         console.log(__dirname + '/screens/' + req.params.video);

//         res.render('index');


//     })
// }