import mongoose from "mongoose";

const messageModel =new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    recieverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    message : {
        type : String , 
        require : true
    }
}, {timestamps: true})

export const Message = new mongoose.model("Message", messageModel)