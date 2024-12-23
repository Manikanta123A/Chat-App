import { Conversation } from "../Models/conversationModel.js";
import { Message } from "../Models/messageModel.js";
import { io } from "../socket/socket.js";
import { getReciverSocketId } from "../socket/socket.js";

export const sendMessage = async (req, res)=>{
    try{
        const senderId = req.id;
        const recieverId = req.params.id;
        const {message} = req.body;
        let gotConversation = await Conversation.findOne({
            participants : {$all: [senderId, recieverId]}
        })

        if (!gotConversation) {
            gotConversation= await Conversation.create ({
                participants : [senderId, recieverId]
            })
        }

        const newMessage = await Message.create({
            senderId,
            recieverId,
            message
        })

        if(newMessage){
            gotConversation.messages.push(newMessage._id)
        };

        await Promise.all([gotConversation.save() , newMessage.save()])

        //Socket.io
        const recieversocketId = getReciverSocketId(recieverId);
        if(recieversocketId !== null){
            io.to(recieversocketId).emit("newMessage", newMessage);
        }

        return res.status(200).json({newMessage})
    }
    catch(error){
        console.log(error)
    }
}

export const getMessage = async (req, res)=>{
    try{
        const recieverId = req.params.id;
        const senderId = req.id;

        const conversations = await Conversation.findOne({
            participants : {$all : [senderId, recieverId]}
        }).populate("messages");

        return res.status(200).json({conversations})

        //Socket.io


    }
    catch(error){
        console.log(error)
    }
}