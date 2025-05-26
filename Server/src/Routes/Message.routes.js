import express from 'express';
import {GetMessages,AddMessage,GetUsers} from '../Controller/Message.controller.js'
import { ValidateRoute } from '../MiddleWare/ValidateRoute.js';
const MessageRouter = express.Router();

MessageRouter.get('/:id' , ValidateRoute , GetMessages);

MessageRouter.put('/:id' , ValidateRoute , AddMessage)

MessageRouter.get('/' ,ValidateRoute ,GetUsers)


export default MessageRouter