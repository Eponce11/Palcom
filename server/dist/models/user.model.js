"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// create the schema corresponding to the document interface
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "{PATH} is required"],
        minlength: [2, "{PATH} must be at least 2 chars"]
    },
    lastName: {
        type: String,
        required: [true, "{PATH} is required"],
        minlength: [2, "{PATH} must be at least 2 chars"]
    },
    email: {
        type: String,
        required: [true, "{PATH} is required"],
        validate: {
            validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "{PATH} is required"],
        minlength: [8, "{PATH} must be at least 8 chars"]
    },
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
