import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/database.js";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/messageRouter.js";
import cors from 'cors'
import { server, app , io } from "./socket/socket.js";

dotenv.config({});

const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())

const corsOption = {
    origin:'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOption))
//middleWare
app.use(express.urlencoded({extended:true}))
app.use ('/api/v1/user', userRouter)
app.use('/api/v1/message', messageRouter )



server.listen(PORT, () =>{
    connectDb();
    console.log(`listenign to server ${PORT}`);
})