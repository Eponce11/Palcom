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
exports.logout = exports.loginUser = exports.createUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = __importDefault(require("../models/user.model"));
exports.createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // destructure the request body
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    // check if the password and confirm password are the same
    if (password !== confirmPassword)
        return res.status(400).json({ error: "Password must match confirm password" });
    // check if the user email is already in use
    const userExists = yield user_model_1.default.findOne({ email: email });
    if (userExists)
        return res.status(400).json({ error: "User already exists" });
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
            .json({ message: "Success" });
    }
    else {
        return res.status(400).json({ error: "Invalid Credentials" });
    }
    ;
}));
const logout = (req, res) => {
    res.clearCookie('userToken');
    res.sendStatus(200);
};
exports.logout = logout;
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
