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






router.get('/hostpage', (req, res) => {
    res.render('host');
})

router.get('/', (req, res) => {
    console.log(__dirname);
    readFromUrl('https://picsum.photos/200/300');

    res.render('index');

});



<<<<<<< HEAD



//CREATE NEW REPO
router.post("/create/repo", (req, res) => {

});




//WILDCARD URL
router.post("/repos(/*)?", (req, res) => {


});

=======
>>>>>>> 0f157cf9df353da35d68bfaad1b936440678c0fd
router.get('/caltrans1', (req, res) => {
    res.render('host');
});
 

<<<<<<< HEAD
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

=======
>>>>>>> 0f157cf9df353da35d68bfaad1b936440678c0fd

function readFromUrl(url) {

    request({ url, encoding: null }, (err, resp, buffer) => {
        // Use the buffer
        // buffer contains the image data
        // typeof buffer === 'object'
        console.log(buffer);
    });
}




module.exports = router;  