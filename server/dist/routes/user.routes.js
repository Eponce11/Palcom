"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controllers_1 = require("../controllers/user.controllers");
const jwt_config_1 = require("../config/jwt.config");
module.exports = (app) => {
    app.post("/api/user/register", user_controllers_1.createUser);
    app.post("/api/user/login", user_controllers_1.loginUser);
    app.get("/api/user/logout", user_controllers_1.logout);
    app.get("/api/user/getUserInfo", jwt_config_1.authenticate, user_controllers_1.getUserInfo);
    app.put("/api/user/update", jwt_config_1.authenticate, user_controllers_1.updateUserInfo);
    app.post("/api/user/findUser", jwt_config_1.authenticate, user_controllers_1.findUser);
    app.post("/api/user/startChat", jwt_config_1.authenticate, user_controllers_1.startChat);
    app.post("/api/user/leaveChat", jwt_config_1.authenticate, user_controllers_1.leaveChat);
    app.get("/api/user/getAllChats", jwt_config_1.authenticate, user_controllers_1.getAllChats);
};
