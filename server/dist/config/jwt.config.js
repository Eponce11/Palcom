"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        return;
    jsonwebtoken_1.default.verify(req.cookies.userToken, secret, (err, payload) => {
        if (err) {
            res.status(401).json({ verified: false });
        }
        else {
            next();
        }
    });
};
exports.authenticate = authenticate;
