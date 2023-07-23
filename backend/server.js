const express = require('express');
const connect = require('./config/db');
const app = express();
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const cors = require('cors');
app.use(cors(
    {
        origin:["https://talk-app-backend.vercel.app/"],
        methods: ["GET", "POST", "PUT"],
        credentials: true
    }
))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://lets-chat-beta.vercel.app');
    next();
  });
app.use(express.json());
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

const server = app.listen(5000,() => {
    console.log("server started on port 5000")
    connect();
})
const io = require('socket.io')(server,{
    cors:{
        origin: "http://localhost:3000"
    },
    pingTimeout: 60000
})

io.on('connection',(socket)=>{
    console.log("connected to server.io")
    socket.on('setup', (userData) =>{
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat',(room) => {
        socket.join(room);
    })

    socket.on('typing',(room) => {
        socket.in(room).emit('typing')
    })
    socket.on('stop typing',(room) => {
        socket.in(room).emit('stop typing')
    })

    socket.on("new message",(newMessageReceived) =>{
        var chat = newMessageReceived.chat;
        if(!chat.users){
            return;
        }
        chat.users.forEach(user => {
            if(user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received",newMessageReceived)
        })
    })


    socket.off("setup",(userData) => {
        socket.leave(userData._id)
    })
})