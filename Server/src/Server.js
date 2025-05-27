import express from 'express';
import dotenv from 'dotenv';
import userRouter from './Routes/User.routes.js'
import { connectDB } from './Lib/dbconnect.js';
import cookieParser from 'cookie-parser';
import MessageRouter from './Routes/Message.routes.js';
import cors from 'cors'
import {app , io ,MainServer} from './Lib/Socket.js'
import path from 'path';
// Load environment variables from .env file
dotenv.config();

//#region Declaration
//#endregion 

const ServerPort  = process.env.PORT
//Router Setup
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json({ limit: '100mb' }));
app.use(cookieParser())
app.use('/users',userRouter);
app.use('/messages' , MessageRouter);
const __dirname = path.resolve()

if(process.env.environment === 'production'){
    app.use(express.static(path.join(__dirname , '../Client/dist')))

    //serve the index.html when any initial url is hit
    app.get('*' , (req , res) => {
        return res.sendFile(path.join(__dirname , "../Client" , "dist" , 'index.html'))
    })
}
try {
    //Here main server serves as base URL for both REST and Socket requets
    MainServer.listen(ServerPort, () => {
        connectDB()
        console.log("Server running on port", ServerPort);
        console.log("Production Port" , import.meta.env?.MODE)
    });
} catch (error) {
    console.error("Server failed to start:", error);
}
