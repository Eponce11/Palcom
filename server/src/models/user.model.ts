

import mongoose, { Schema, model, mongo } from "mongoose";
import bcrypt from 'bcryptjs'

// create an interface representing a document in MongoDB
interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    username: string
    chats: Array<string>;
}

// create the schema corresponding to the document interface
const UserSchema = new Schema<User>({
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
            validator: (val:any) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true })

// hash the password before it is saved to db
UserSchema.pre("save", function(next): void {
    bcrypt.hash(this.password, 10)
        .then( hash => {
            this.password = hash;
            next();
        })
});

const User = model<User>("User", UserSchema);

export default User;