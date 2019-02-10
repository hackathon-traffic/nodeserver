const port = 8080;

const path = require('path');
const express = require('express');
const controller = require('./controller.js');

//for using http server instead of express server 
var app = express();
app.use(controller);
app.use('', controller);

var server = require('http').createServer(app);
const {exec} = require('child_process')

app.set('view engine', 'ejs');

server.listen(port, () => {
    
    setInterval(scrape, 200, 1, 'rtmp://wzmedia.dot.ca.gov:1935/D4/W80_at_Carlson_Blvd_OFR.stream');
    setInterval(scrape, 200, 2, 'rtmp://wzmedia.dot.ca.gov:1935/D4/E580_Lower_Deck_Pier_16.stream');
    setInterval(scrape, 200, 3, 'rtmp://wzmedia.dot.ca.gov:1935/D4/S101_at_Airport_Bl.stream');
    setInterval(scrape, 200, 4, 'rtmp://wzmedia.dot.ca.gov/D4/W80_at_Ashby.stream');
    
    function scrape(index, url) {
        script = 'ffmpeg -y -i ' + url + ' yolo/input/' + 'location' + index + '.jpg'
        exec(script)
    };

    console.log("Server started on port" + port);
});
