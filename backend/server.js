const express = require('express');
const connect = require('./config/db');
const app = express();
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const cors = require('cors');
app.use(cors())
app.use(express.json());
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);

app.listen(5000,() => {
    console.log("server started on port 5000")
    connect();
})