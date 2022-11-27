
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'; 
import Message from '../models/message.model';
import { type } from 'os';

export const createMessage = asyncHandler(async (req:Request, res: Response): Promise<any> => {
    const { to, message } = req.body;
    const from = getTokenId(req.cookies.userToken);
    
    const data = await Message.create({
        text: message,
        users: [from, to],
        sender: from
    })

    if (!data) return res.status(400).json({ error: "Failed to add message" })
    
    return res.json({ msg: data.text })
})

export const getAllChatMessage = asyncHandler(async (req:Request, res: Response): Promise<any> => {

    const { to } = req.body;
    const from = getTokenId(req.cookies.userToken);

    const messages = await Message.find({
        users: {
            $all: [from, to]
        }
    }).sort({ updatedAt: 1 });

    const projectMessages = messages.map( (msg) => {
        return {
            fromSelf: msg.sender.toString() === from,
            text: msg.text
        }
    }).reverse();

    return res.json(projectMessages);
    
})

const getTokenId = (token: any) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "Invalid");
    if (typeof payload === 'string') return null;
    return payload.id
}

