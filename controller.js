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

    res.render('index');

});



router.get('/caltrans1', (req, res) => {
    res.render('host');
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