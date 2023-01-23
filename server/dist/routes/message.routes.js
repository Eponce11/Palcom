"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_controllers_1 = require("../controllers/message.controllers");
const jwt_config_1 = require("../config/jwt.config");
module.exports = (app) => {
    app.post("/api/message/create", jwt_config_1.authenticate, message_controllers_1.createMessage);
    app.post("/api/message/getAllChatMessages", jwt_config_1.authenticate, message_controllers_1.getAllChatMessage);
};
