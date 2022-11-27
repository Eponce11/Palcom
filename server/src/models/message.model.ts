
import mongoose, { Schema, model } from "mongoose";

interface Message {
    text: string;
    users: Array<string>;
    sender: object;
}

const MessageSchema = new Schema<Message>({
    text: {
        type: String,
        required: true
    },
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })

const Message = model<Message>("Message", MessageSchema);

export default Message;