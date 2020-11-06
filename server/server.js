const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

io.on("connection", (socket) => {
  console.log(socket.id + " 접속됨")
  socket.emit("your id", socket.id); //클라이언트에 보낼 데이터
  socket.on("timer start sign", (message) => {
      console.log(message);
    
    io.emit("timer start", "timer start 명령 받음");

  });
});

server.listen(8000, () => console.log("server is running on port 8000"));