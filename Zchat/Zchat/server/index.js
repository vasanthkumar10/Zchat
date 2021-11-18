const express = require('express');
const http = require('http');
const app = express()
const server = http.createServer(app);
const socketio = require('socket.io')(server, {
    cors: true,
    origins: ["http://127.0.0.1:7000"],
    methods: ["GET", "POST"]
});
const cors = require('cors');

const PORT = process.env.PORT || 7000;
const router = require('./router');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./user');

app.use(cors());
app.use(router);

socketio.on('connection', (socket) => {

    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) return callback(error);
        socket.emit('message', { user: 'admin', text: `${user.name}, Welcome to the ${user.room}` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined` });
        socketio.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        socket.join(user.room);

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        if (user) {
            socketio.to(user.room).emit('message', { user: user.name, text: message });
        }
        callback();
    });

    socket.on('disconnected', (name) => {
        const user = removeUser(name);
        if (user) {
            socketio.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
            socketio.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));