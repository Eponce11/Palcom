"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// create the schema corresponding to the document interface
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "is required"],
        minlength: [2, "must be at least 2 chars"]
    },
    lastName: {
        type: String,
        required: [true, "is required"],
        minlength: [2, "must be at least 2 chars"]
    },
    email: {
        type: String,
        required: [true, "is required"],
        validate: {
            validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Invalid"
        }
    },
    password: {
        type: String,
        required: [true, "is required"],
        minlength: [8, "must be at least 8 chars"]
    },
    username: {
        type: String,
        required: [true, "is required"],
        minLength: [1, "must be at least 1 char"]
    },
    chats: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });
// hash the password before it is saved to db
UserSchema.pre("save", function (next) {
    bcryptjs_1.default.hash(this.password, 10)
        .then(hash => {
        this.password = hash;
        next();
    });
});
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
