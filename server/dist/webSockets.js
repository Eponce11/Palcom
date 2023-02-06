"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
module.exports = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000'
        }
    });
    const onlineUsers = new Map();
    io.on("connection", (socket) => {
        console.log(socket.id);
        socket.on("add-user", (userId) => {
            onlineUsers.set(userId, socket.id);
        });
        socket.on("send-msg", (data) => {
            const sendUserSocket = onlineUsers.get(data.to);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit("msg-receive", data.message);
            }
        });
    });
};
