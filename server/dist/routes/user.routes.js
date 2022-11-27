"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controllers_1 = require("../controllers/user.controllers");
const jwt_config_1 = require("../config/jwt.config");
module.exports = (app) => {
    app.post("/api/user/create", user_controllers_1.createUser);
    app.post("/api/user/login", user_controllers_1.loginUser);
    app.get("/api/user/logout", jwt_config_1.authenticate, user_controllers_1.logout);
};
