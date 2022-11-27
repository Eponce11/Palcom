
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model'


export const createUser = asyncHandler(async (req:Request, res: Response): Promise<any> => {

    // destructure the request body
    const { email, password, confirmPassword, username } = req.body;

    // check if the password and confirm password are the same
    if (password !== confirmPassword) return res.status(400).json({ confirmPassword: { message: "must match password" } })

    // check if the user email is already in use
    const userEmail = await User.findOne({ email: email });
    const userUsername = await User.findOne({ username: username });

    if (userEmail || userUsername) {
        const errors: any = {};
        if (userEmail && userEmail.email === email) errors.email = { message: "in use" };
        if (userUsername && userUsername.username === username) errors.username = { message: "in use" }
        return res.status(400).json(errors);
    }

    // create the user with the request body
    User.create(req.body)
        .then( (newUser) => { 
            return res
                // create a cookie and give it the token
                .cookie("userToken", generateToken(newUser.id), { httpOnly: true })
                .json({ message: "Success" })
        })
        .catch( (err) => { return res.status(400).json({ error: err })} );
})

export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    // destructure the request body
    const { email, password } = req.body;

    // find the user with corresponding email in db
    const user = await User.findOne({ email: email });

    // check if the user was found and the password matches the one in the db
    if (user && (await bcrypt.compare(password, user.password))) {
        return res
            // create a cookie and give it the token
            .cookie("userToken", generateToken(user.id), { httpOnly: true })
            .json({ id: user.id, username: user.username })
    }else{
        return res.status(400).json({ error: "Invalid Credentials" })
    };
})

export const getUserInfo = asyncHandler(async (req:Request, res:Response): Promise<any> => {
    
    const loggedInUserId = getTokenId(req.cookies.userToken);

    const user = await User.findById(loggedInUserId)

    if (user) {
        return res.json({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        })
    }else{
        return res.status(400).json({ error: "User not found" })
    }
})

export const updateUserInfo = asyncHandler(async (req:Request, res:Response): Promise<any> => {
    const { firstName, lastName, email, username } = req.body;
    
    const loggedInUserId = getTokenId(req.cookies.userToken);

    const loggedInUser = User.findById(loggedInUserId);
    

    User.findByIdAndUpdate(
        { _id: loggedInUserId },
        { 
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username
        },
        { new: true, runValidators: true }
    )
        .then( (updatedUser) => {
            return res.json({
                username: updatedUser?.username,
                firstName: updatedUser?.firstName,
                lastName: updatedUser?.lastName,
                updatedUser: updatedUser?.email
            })
        })
        .catch( (err) => {
            return res.status(400).json({ error: err })
        })



})


export const findUser = asyncHandler(async (req:Request, res: Response): Promise<any> => {
    const { username } = req.body;

    const user = await User.findOne({ username: username });
    
    if (user) {
        return res.json({ 
            username: user.username,
            id: user.id
        })
    }else{
        return res.status(400).json({ error: "User not found" })
    } 

})

export const startChat = asyncHandler(async (req:Request, res: Response): Promise<any> => {
    const { id } = req.body;

    const loggedInUserId = getTokenId(req.cookies.userToken);

    const loggedInUser = await User.findById(loggedInUserId);
    if (!loggedInUser) res.status(400).json({ error: "Error" });
    if (loggedInUser?.chats.includes(id)) return res.status(400).json({ error: "Chat Exists" })

    loggedInUser?.updateOne({ $push: { chats: id } })
        .then( (user) => {
            return res.json({ message: "Chat Created" })
        })
        .catch( (err) => {
            return res.status(400).json({ error: err })
        })

})

export const leaveChat = asyncHandler(async (req:Request, res:Response): Promise<any> => {
    const { id } = req.body;

    const loggedInUserId = getTokenId(req.cookies.userToken);

    User.findByIdAndUpdate(
        loggedInUserId,
        { $pull: { chats: id } }
    )
        .then( (user) => {
            return res.json({ message: "Chat left" })
        })
        .catch( (err) => {
            return res.status(400).json({ error: err })
        })
})

export const getAllChats = asyncHandler(async (req:Request, res:Response): Promise<any> => {

    const loggedInUserId = getTokenId(req.cookies.userToken);
    const loggedInUser = await User
        .findById(loggedInUserId)
        .select("chats")
        .populate("chats", "username");

    if (!loggedInUser) return res.status(400).json({ error: "Check" })

    return res.json({ chats: loggedInUser?.chats })
})



export const logout = (req:Request, res:Response) => {
    res.clearCookie('userToken');
    res.sendStatus(200);
}



const getTokenId = (token: any) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "Invalid");
    if (typeof payload === 'string') return null
    return payload.id
}

// Generate JWT
const generateToken = (id:string) => {
    // gets secret from the .env file and checks its not undefined
    const secret = process.env.JWT_SECRET;
    if (!secret) return;

    // returns a signed token
    return jwt.sign({ id: id }, secret, {
        expiresIn: '1d'
    })
}

