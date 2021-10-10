const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const router = require('./router')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT | 5000

const app = express();

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log("We have a new connection!");
    socket.on('join', ({name, room}, callback) => {
        console.log(`Hello from ${name} who just joined room ${room}!`)
        const {error, user} = addUser({id:socket.id, name,room});
        if(error)
            return callback(error);
        socket.emit('meesage', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`})
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined.`})
        socket.join(user.room)
    })
    socket.on('disconnect', () => {
        console.log("User has left!")
    })
});

app.use(require('cors')());
app.use(router)

server.listen(PORT, () => (
    console.log(`Server starting on ${PORT}`)
))