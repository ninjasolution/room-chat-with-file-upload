const fs = require('fs');
const path = require('path');
const service = require('../service');
const _ = require('lodash')

module.exports = (server) => {
 
  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["rtc-app-header"],
      credentials: true
    }
  });

  service.serverSocket = io;

  io.sockets.on('error', err => console.log(err));
  
  io.sockets.on("connection", socket => {
  
    console.log('a user connected')
    
    socket.on('createRoom', (req) => {
      service.createRoom(req.roomName, req.password, socket);
      socket.join(req.roomName)
    })

    socket.on('setStop', req => {
      service.isStop = req.state;
      io.to(req.roomName).emit('setStop', req.state);

    })

    socket.on('msgToClientsOfMyRoom', req => {
      req.createdAt = Date.now();
      io.to(req.roomName).emit('msgToClientsOfMyRoom', req)
    })

    socket.on('joinToRoom', (req) => {

      if(req.whoAmI === 'admin') {
        socket.emit('allRomes', service.rooms)
        return;
      }

      socket.join(req.roomName)
      const selectedRoom = service.rooms.find(r => r.name === req.roomName);
      if(typeof selectedRoom === "undefined" || selectedRoom === null) return;
      req.socketId = socket.id;
      selectedRoom.clients.push(req);
      io.to(selectedRoom.name).emit("changedRoom", selectedRoom)
    })

    socket.on('loadFiles', e => {
      const directoryPath = path.join(__dirname, 'files');
      //passsing directoryPath and callback function
      fs.readdir('./files', function (err, files) {
          //handling error
          if (err) {
              return console.log('Unable to scan directory: ' + err);
          } 

          socket.emit('allFiles', files);
          //listing all files using forEach
          files.forEach(function (file) {
              // Do whatever you want to do with the file
              console.log(file); 
          });
      });
    })

    socket.on('deleteRoom', roomName => {
      service.removeRoom(roomName);
    })

    io.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
    });

    io.of("/").adapter.on("join-room", (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });

    socket.on('disconnect', () => {
      
      let selectedRoom = null;
      service.rooms = service.rooms.map( r => {
        let client = r.clients.find(c => c.socketId === socket.id);
        if(typeof client !== "undefined" && client !== null) selectedRoom = r;

        return {
              ...r,
              clients: r.clients.filter(c => c.socketId !== socket.id)
            }
      })

      if(typeof selectedRoom === "undefined" || selectedRoom === null) return;

      io.to(selectedRoom.name).emit('changedRoom', service.rooms.find(r => r.name === selectedRoom.name))
      console.log('disconnected')
    })
    
  });

  return io;
}

