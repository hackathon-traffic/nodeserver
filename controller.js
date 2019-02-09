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

    let options = {
        mode: 'text',
        //set your path to python
        // pythonPath: 'C:\\Users\\vidul\\AppData\\Local\\Programs\\Python\\Python37-32\\python.exe',
        pythonOptions: ['-u'], // get print results in real-time
        //set your path to script
        scriptPath: '/Users/iwilliamlee/Desktop/hackathon/nodeserver',
        // args: ['-i', 'cat.jpg', '-c', 'yolov3.cfg', '-w', 'yolov3.weights', '-cl', 'yolov3.txt']
    };

    PythonShell.run('test.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: j', results);
    });

    res.render('index');


});




//CREATE NEW REPO
router.post("/create/repo", (req, res) => {

});


//WILDCARD URL
router.post("/repos(/*)?", (req, res) => {


});

router.get('/caltrans1', (req, res) => {
    res.render('host');
});
 

//Read from mpeg server
router.get("/getImage", async (req, res) => {
    var webshot = require('webshot');
    var fs      = require('fs');

    var options = {
        screenSize: {
          width: 320
        , height: 480
        },
        styleType:'html',
    };

    var renderStream = webshot('http://localhost:8080/caltrans1', options);

    var fileName = 'google';

    var i;
    for (i = 0; i < 10; i++) { 
        await renderStream.on('data', function(data) {
            var newFileName = fileName + i;
            var file = fs.createWriteStream(newFileName + '.png', {encoding: 'binary'});
            file.write(data.toString('binary'), 'binary');
        });
    }
    res.send('Success');
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