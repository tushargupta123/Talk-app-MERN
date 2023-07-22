const expressAsyncHandler = require("express-async-handler");
const Message = require('../models/MessageModel');
const User = require("../models/UserModel");
const Chat = require("../models/chatModel");

const sendMessage = expressAsyncHandler(async(req,res) => {
    const {content,chatId} = req.body;
    if(!content || !chatId) {
        console.log("invalid data passed into request")
        return res.status(400)
    }

    var newMessage = {
        sender:req.user._id,
        content,
        chat:chatId
    }

    try{
        var message = await Message.create(newMessage)

        message = await message.populate("sender","name pic")
        message = await message.populate("chat")
        message = await User.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage: message
        })
        res.json(message)
    }catch(e){
        throw new Error(e)
    }
})
const allMessages = expressAsyncHandler(async(req,res) => {
    try{
        const messages = await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat");
        res.json(messages)
    }catch(e){
        throw new Error(e)
    }
})

module.exports = {sendMessage,allMessages}