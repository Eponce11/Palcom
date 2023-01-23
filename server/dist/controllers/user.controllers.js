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
exports.logout = exports.getAllChats = exports.leaveChat = exports.startChat = exports.findUser = exports.updateUserInfo = exports.getUserInfo = exports.loginUser = exports.createUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = __importDefault(require("../models/user.model"));
exports.createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // destructure the request body
    const { email, password, confirmPassword, username } = req.body;
    // check if the password and confirm password are the same
    if (password !== confirmPassword)
        return res.status(400).json({ confirmPassword: { message: "must match password" } });
    // check if the user email is already in use
    const userEmail = yield user_model_1.default.findOne({ email: email });
    const userUsername = yield user_model_1.default.findOne({ username: username });
    if (userEmail || userUsername) {
        const errors = {};
        if (userEmail && userEmail.email === email)
            errors.email = { message: "in use" };
        if (userUsername && userUsername.username === username)
            errors.username = { message: "in use" };
        return res.status(400).json(errors);
    }
    // create the user with the request body
    user_model_1.default.create(req.body)
        .then((newUser) => {
        return res
            // create a cookie and give it the token
            .cookie("userToken", generateToken(newUser.id), { httpOnly: true })
            .json({ message: "Success" });
    })
        .catch((err) => { return res.status(400).json({ error: err }); });
}));
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // destructure the request body
    const { email, password } = req.body;
    // find the user with corresponding email in db
    const user = yield user_model_1.default.findOne({ email: email });
    // check if the user was found and the password matches the one in the db
    if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
        return res
            // create a cookie and give it the token
            .cookie("userToken", generateToken(user.id), { httpOnly: true })
            .json({ id: user.id, username: user.username });
    }
    else {
        return res.status(400).json({ error: "Invalid Credentials" });
    }
    ;
}));
exports.getUserInfo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = getTokenId(req.cookies.userToken);
    const user = yield user_model_1.default.findById(loggedInUserId);
    if (user) {
        return res.json({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    }
    else {
        return res.status(400).json({ error: "User not found" });
    }
}));
exports.updateUserInfo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, username } = req.body;
    const loggedInUserId = getTokenId(req.cookies.userToken);
    const duplicateInfoUsers = yield user_model_1.default.find({
        $and: [
            { _id: { $ne: loggedInUserId } },
            { $or: [
                    { email: email },
                    { username: username }
                ] }
        ]
    });
    if (duplicateInfoUsers.length > 0) {
        const errors = {};
        for (const user of duplicateInfoUsers) {
            if (user.username === username)
                errors.username = { message: "in use" };
            if (user.email === email)
                errors.email = { message: "in use" };
        }
        return res.status(400).json(errors);
    }
    // return res.json({ msg: "Message" })
    user_model_1.default.findByIdAndUpdate({ _id: loggedInUserId }, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username
    }, { new: true, runValidators: true })
        .then((updatedUser) => {
        return res.json({
            username: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.username,
        });
    })
        .catch((err) => {
        return res.status(400).json(err.errors);
    });
}));
exports.findUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    const user = yield user_model_1.default.findOne({ username: username });
    if (user) {
        return res.json({
            username: user.username,
            id: user.id
        });
    }
    else {
        return res.status(400).json({ error: "User not found" });
    }
}));
exports.startChat = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const loggedInUserId = getTokenId(req.cookies.userToken);
    const loggedInUser = yield user_model_1.default.findById(loggedInUserId);
    if (!loggedInUser)
        res.status(400).json({ error: "Error" });
    if (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.chats.includes(id))
        return res.status(400).json({ error: "Chat Exists" });
    loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.updateOne({ $push: { chats: id } }).then((user) => {
        return res.json({ message: "Chat Created" });
    }).catch((err) => {
        return res.status(400).json({ error: err });
    });
}));
exports.leaveChat = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const loggedInUserId = getTokenId(req.cookies.userToken);
    user_model_1.default.findByIdAndUpdate(loggedInUserId, { $pull: { chats: id } })
        .then((user) => {
        return res.json({ message: "Chat left" });
    })
        .catch((err) => {
        return res.status(400).json({ error: err });
    });
}));
exports.getAllChats = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = getTokenId(req.cookies.userToken);
    const loggedInUser = yield user_model_1.default
        .findById(loggedInUserId)
        .select("chats")
        .populate("chats", "username");
    if (!loggedInUser)
        return res.status(400).json({ error: "Check" });
    return res.json({ chats: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.chats });
}));
const logout = (req, res) => {
    res.clearCookie('userToken');
    res.sendStatus(200);
};
exports.logout = logout;
const getTokenId = (token) => {
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "Invalid");
    if (typeof payload === 'string')
        return null;
    return payload.id;
};
// Generate JWT
const generateToken = (id) => {
    // gets secret from the .env file and checks its not undefined
    const secret = process.env.JWT_SECRET;
    if (!secret)
        return;
    // returns a signed token
    return jsonwebtoken_1.default.sign({ id: id }, secret, {
        expiresIn: '1d'
    });
};
