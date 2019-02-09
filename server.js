const port = 8080;

const path = require('path');
const express = require('express');
const controller = require('./controller.js');

//for using http server instead of express server 
var app = express();
app.use(controller);
app.use('', controller);

var server = require('http').createServer(app);
let { PythonShell } = require('python-shell')

app.set('view engine', 'ejs');

server.listen(port, () => {
    // let options = {
    //     mode: 'text',
    //     //set your path to python
    //     // pythonPath: 'C:\\Users\\vidul\\AppData\\Local\\Programs\\Python\\Python37-32\\python.exe',
    //     pythonOptions: ['-u'], // get print results in real-time
    //     //set your path to script
    //     scriptPath: '/Users/iwilliamlee/Desktop/hackathon/nodeserver',
    //     // args: ['-i', 'cat.jpg', '-c', 'yolov3.cfg', '-w', 'yolov3.weights', '-cl', 'yolov3.txt']
    // };

    // PythonShell.run('test.py', options, function (err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: j', results);
    // });

    // PythonShell.run('test.py', options, function (err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: j', results);
    // });

    // PythonShell.run('test.py', options, function (err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: j', results);
    // });


    // PythonShell.run('test.py', options, function (err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: j', results);
    // });


    console.log("Server started on port" + port);
});
