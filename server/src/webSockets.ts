
import { Server } from 'socket.io'

module.exports = (httpServer:any):any => {

    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000'
        }
    })

    io.on("connection", (socket) => {
        console.log(socket.id);
    })
}