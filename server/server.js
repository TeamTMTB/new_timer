const { count } = require("console");
const express = require("express");
const http = require("http");
const { resolve } = require("path");
const redis = require("redis");
const client = redis.createClient();
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

function getRoomsKeys(){
  return new Promise((resolve) => {
    client.keys("room:*", (err, rooms) => {
      resolve(rooms)
    })
  })
}

async function getRoomsInfo(roomsKey){
  let roomsInfo = []

  for (const roomKey of roomsKey){
    let result = await new Promise((resolve) => {
      client.hgetall(roomKey , (err, reply) =>{
        resolve(reply);
      });
    });
    // console.log(result);
    roomsInfo.push(result);
    console.log(roomsInfo);
  }

  return roomsInfo;
}

//   let result = await new Promise((resolve) => {
//     client.hgetall(roomKey , (err, reply) =>{
//       resolve(reply);
//     });
//   });
//   roomsInfo.push(result);
//   return roomsInfo;
  // return new Promise( (resolve) => {
  //   roomsKey.forEach(async (roomKey) => {
  //     let result = await new Promise((resolve) => {
  //       client.hgetall(roomKey , (err, reply) =>{
  //         resolve(reply);
  //       });
  //     });
  //     console.log(result);
  //     roomsInfo.push(result);
  //     console.log(roomsInfo);
  //   });
  //   resolve(roomsInfo);
  // })

// }

app.get('/rooms', async (req, res) => {
  // res.send('서버 get 응답함!');
  let roomsInfo = []
  let roomsKey = await getRoomsKeys();
  console.log(roomsKey);
  roomsInfo = await getRoomsInfo(roomsKey);
  // const promises = roomsKey.map(getRoomsInfo);
  // await Promise.all(roomsKey.forEach( async (key) => {
  //   return new Promise((resolve) => {
  //     client.hgetall(key , (err, reply) =>{
  //     resolve(reply);
  //     });
  //     roomsInfo.push(result);
  //   });
  // }))

  console.log(roomsInfo);
  res.send(roomsInfo);
  // return res.json({title:"ekfkefe"});
  
});  

io.on("connection", (socket) => {
  console.log(socket.id + " 접속됨")
  socket.emit("your id", socket.id); //클라이언트에 보낼 데이터

  client.hmset(`${socket.id} count`, {nowCount: 0, max: 4})

  socket.on("timer start sign", (message) => {
    console.log(message);
    client.hgetall(`${socket.id} count`, (err, reply) => {
      
      client.hmset(`${socket.id} count`,{...reply, nowCount: parseInt(reply.nowCount)+1});

      console.log(reply);
      });
    io.emit("timer start", "timer start 명령 받음");

  });
});
const id = "efefefef"
// client.hmset("name", {[id]: 0, max: 4});
client.hmset("employees", { HR: "Anthony", MIS: " Clint", Accounting: "Mark" });
client.hgetall("employees", function(err, object) {
  console.log(object);
});
// client.hmget("name", id, (err, reply) => {
//   console.log(reply);
// })



server.listen(8000, () => console.log("server is running on port 8000"));