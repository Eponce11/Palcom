"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChatMessage = exports.createMessage = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const message_model_1 = __importDefault(require("../models/message.model"));
exports.createMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, message } = req.body;
    const from = getTokenId(req.cookies.userToken);
    const data = yield message_model_1.default.create({
        text: message,
        users: [from, to],
        sender: from
    });
    if (!data)
        return res.status(400).json({ error: "Failed to add message" });
    return res.json({ msg: data.text });
}));
exports.getAllChatMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to } = req.body;
    const from = getTokenId(req.cookies.userToken);
    const messages = yield message_model_1.default.find({
        users: {
            $all: [from, to]
        }
    }).sort({ updatedAt: 1 });
    const projectMessages = messages.map((msg) => {
        return {
            fromSelf: msg.sender.toString() === from,
            text: msg.text
        };
    }).reverse();
    return res.json(projectMessages);
}));
const getTokenId = (token) => {
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "Invalid");
    if (typeof payload === 'string')
        return null;
    return payload.id;
};
