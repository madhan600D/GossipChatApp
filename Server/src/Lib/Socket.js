import http from 'http'
import {Server} from 'socket.io'
import express from 'express'

export const app = express()
//We are creating a Http Server because s
export const MainServer = http.createServer(app)

export const io = new Server(MainServer , {
    cors:["http://localhost:5173"],
})
const OnlineUsersServer = {}

io.on("connection", (socket) => {
  console.log("A User socket connected", socket.id);
  const UserID = socket.handshake.query.ID;
  OnlineUsersServer[UserID] = socket.id;
  console.log("OnlineUsersObj: Server" , OnlineUsersServer)
  io.emit("OnlineUsers", Object.keys(OnlineUsersServer));

  socket.on("disconnect", () => {
    delete OnlineUsersServer[UserID];
    io.emit("OnlineUsers", Object.keys(OnlineUsersServer));
    console.log("OnlineUsersObj: Server" , OnlineUsersServer)
    console.log("User socket disconnected", socket.id);
  });
});

export const GetSocketID = (id) => {
    //Return Socket ID for thr user
    return OnlineUsersServer[id]
}