
import { Server } from 'socket.io'

module.exports = (httpServer:any):any => {

    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000'
        }
    })

    const onlineUsers: Map<any, any> = new Map();

    io.on("connection", (socket) => {

        console.log(socket.id);
        socket.on("add-user", (userId) => {
            onlineUsers.set(userId, socket.id)
        })
        socket.on("send-msg", (data) => {
            const sendUserSocket = onlineUsers.get(data.to);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit("msg-receive", data.message)
            }
        })

    })
}