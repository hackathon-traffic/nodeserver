var socket = io.connect('');

socket.on('connect', () => {
    socket.on("image", function (img) {
        if (img.image) {
            console.log('image buffer received ');
            // var img = new Image();
            // img.src = 'data:image/jpeg;base64,' + info.buffer;
            // ctx.drawImage(img, 0, 0);
        }
    });
    socket.on("text", function (text) {
        if (text) {
            console.log('text buffer received ');
            // var img = new Image();
            // img.src = 'data:image/jpeg;base64,' + info.buffer;
            // ctx.drawImage(img, 0, 0);
        }
    });

    socket.emit('filename', { filename: 'abcd.txt' });

    socket.on('disconnect', () => {
        console.log("socket disconnected");
    })
})

