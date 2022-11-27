
import { Application } from 'express';
import { createMessage, getAllChatMessage } from "../controllers/message.controllers"
import { authenticate } from '../config/jwt.config'

module.exports = (app: Application) => {
    app.post("/api/message/create", authenticate, createMessage);
    app.post("/api/message/getAllChatMessages",  authenticate, getAllChatMessage);
}