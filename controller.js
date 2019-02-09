const express = require('express');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
const request = require('request');
const webshot = require('webshot');


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
        args: ['-i', 'cat.jpg', '-c', 'yolov3.cfg', '-w', 'yolov3.weights', '-cl', 'yolov3.txt']
    };

    PythonShell.run('yolo.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: j', results);
    });

    res.render('index');


});




//CREATE NEW REPO
router.post("/create/repo", (req, res) => {

});

router.get("/takescreenshot", (req, res) => {
    webshot('https://www.google.com/', './screens/abcd.png', (err) => {
        if (err) console.log(err);
        else res.sendStatus(200);
    })
});



//WILDCARD URL
router.post("/repos(/*)?", (req, res) => {


});



//Read from mpeg server
router.get("/getImage", (req, res) => {
    var webshot = require('webshot');
    webshot('<html><body>Hello World</body></html>', 'hello_world.png', {siteType:'html'}, function(err) {
        // screenshot now saved to hello_world.png
        var img = fs.readFileSync('./hello_world.png');
        res.writeHead(200, {'Content-Type': 'image' });
        res.send(img, 'binary');
      });
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