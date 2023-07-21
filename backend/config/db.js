const mongoose = require('mongoose');

const connect = async() => {
    try{
        await mongoose.connect('mongodb+srv://tushargupta2k3:tUshar%40123@twitter.fzbvq5v.mongodb.net/talk');
        console.log("database connection established")
    }catch(err){
        console.log(err)
    }
}

module.exports = connect;