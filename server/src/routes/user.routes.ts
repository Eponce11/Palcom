
import { Application } from 'express';
import { createUser, loginUser, logout, findUser, startChat, leaveChat, getAllChats, getUserInfo, updateUserInfo } from "../controllers/user.controllers";
import { authenticate } from '../config/jwt.config';


module.exports = (app: Application) => {
    app.post("/api/user/register", createUser);
    app.post("/api/user/login", loginUser);
    app.get("/api/user/logout", logout)
    app.get("/api/user/getUserInfo", authenticate, getUserInfo)
    app.put("/api/user/update", authenticate, updateUserInfo)
    app.post("/api/user/findUser", authenticate, findUser);
    app.post("/api/user/startChat", authenticate, startChat);
    app.post("/api/user/leaveChat", authenticate, leaveChat);
    app.get("/api/user/getAllChats", authenticate, getAllChats);
}


