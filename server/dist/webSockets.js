"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
module.exports = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000'
        }
    });
    io.on("connection", (socket) => {
        console.log(socket.id);
    });
};
