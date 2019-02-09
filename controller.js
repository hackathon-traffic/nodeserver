const express = require('express');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
const request = require('request');


let { PythonShell } = require('python-shell')


// sends a message to the Python script via stdin


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/', (req, res) => {
    console.log(__dirname);
    readFromUrl('https://picsum.photos/200/300');

    // let options = {
    //     mode: 'text',
    //     // pythonPath: './',
    //     // pythonOptions: ['-u'], // get print results in real-time
    //     scriptPath: '/',
    //     args: ['value1', 'value2', 'value3']
    // };

    // PythonShell.run('test.py', options, function (err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: %j', results);
    // });

    res.render('index');


});




//CREATE NEW REPO
router.post("/create/repo", (req, res) => {

});


//WILDCARD URL
router.post("/repos(/*)?", (req, res) => {


});



//Read from mpeg server
router.get("/getImage", (req, res) => {


    const puppeteer = require('puppeteer');
    const url = 'https://www.reddit.com';

    puppeteer
    .launch()
    .then(function(browser) {
        return browser.newPage();
    })
    .then(function(page) {
        return page.goto(url).then(function() {
            return page.content();
        });
    })
    .then(function(html) {
        return 
        console.log(html);
    })
    .catch(function(err) {
        //handle error
    });
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var request = new XMLHttpRequest();
    request.open("GET", "http://www.dot.ca.gov/d4/d4cameras/ct-cam-pop-N1_at_Presidio_Tunnel.html", true);
    request.send(null);
    request.onreadystatechange = function() {
      if (request.readyState == 4)
         console.log(request);


    };
    console.log('We are sending back a response');
    res.send('Hello World'); 
});
 

function readFromUrl(url) {

    request({ url, encoding: null }, (err, resp, buffer) => {
        // Use the buffer
        // buffer contains the image data
        // typeof buffer === 'object'

        console.log(buffer);
    });
}




module.exports = router;  