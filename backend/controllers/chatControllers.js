const expressAsyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require("../models/UserModel");

const accessChat = expressAsyncHandler(async (req,res) => {
    const {userId} = req.body;
    if(!userId){
        console.log("userId is required");
        return res.sendStatus(400);
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and:[
            {
                users:{$elemMatch:{$eq:req.user._id}}
            },
            {
                users:{$elemMatch:{$eq:userId}}
            }
        ]
    }).populate("users","-password").populate("latestMessage")
    isChat = await User.populate(isChat,{
        path: "latestMessage.sender",
        select: "name pic email"
    });
    if( isChat.length > 0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users:[req.user._id,userId]
        };

        try{
            const createChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createChat._id}).populate("users","-password");
            res.status(200).send(FullChat);
        }catch(e){
            throw new Error(e);
        }
    }
})

const fetchChats = expressAsyncHandler(async(req,res) => {
    try{
        Chat.find({users:{$elemMatch: {$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updateAt: -1})
        .then(async(result) => {
            result = await User.populate(result,{
                path: "latestMessage.sender",
                select: "name pic email"
            })
            res.status(200).send(result);
        })
    }catch(e){
        res.status(400);
        throw new Error(e);
    }
})

const createGroupChat = expressAsyncHandler(async(req,res) => {
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message: "please fill in all the fields"})
    }
    var users = JSON.parse(req.body.users);
    if(users.length < 2){
        return res.status(400).send("more than 2 users required to form a group chat")
    }
    users.push(req.user);

    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users:users,
            isGroupChat: true,
            groupAdmin:req.user
        })
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");

        res.status(200).send(fullGroupChat);
    }catch(e){
        res.status(400);
        throw new Error(e);
    }
})

const renameGroup = expressAsyncHandler(async(req,res) => {
    const {chatId,chatName} = req.body;
    const updateChat = await Chat.findByIdAndUpdate(chatId,{
        chatName
    },{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!updateChat){
        res.send(404)
        throw new Error("Chat not found");
    }else{
        res.json(updateChat);
    }
})

const addToGroup = expressAsyncHandler(async(req,res) => {
    const {chatId,userId} = req.body;
    const added = await Chat.findByIdAndUpdate(chatId,{
        $push:{
            users:userId
        }
    },{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!added){
        res.send(404)
        throw new Error("Chat not found");
    }else{
        res.json(added);
    }
})

const removeFromGroup = expressAsyncHandler(async(req,res) => {
    const {chatId,userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId,{
        $pull:{
            users:userId
        }
    },{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!removed){
        res.send(404)
        throw new Error("Chat not found");
    }else{
        res.json(removed);
    }
})

module.exports = {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}