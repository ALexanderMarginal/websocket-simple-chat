const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const events = require('./events');

const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on(events.chatMessage, (msg) => {
        socket.broadcast.emit(events.chatMessage, msg);
    });
    socket.on(events.login, username => socket.broadcast.emit(events.login, username))
    socket.on('disconnect', reason => {
        io.emit(events.logout, reason);
    });
});

server.listen(process?.env?.PORT || 5000, () => {
    console.log('listening on *:3000');
});
