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
    //     pythonOptions: ['-u'], // get print results in real-time
    //     scriptPath: './pyshells/',
    // };

    // PythonShell.run('test1.py', options, function (err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: j', results);
    // });

    // PythonShell.run('test2.py', options, function (err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: j', results);
    // });

    // PythonShell.run('test3.py', options, function (err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: j', results);
    // });


    // PythonShell.run('test4.py', options, function (err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: j', results);
    // });


    console.log("Server started on port" + port);
});
