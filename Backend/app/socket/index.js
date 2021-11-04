const fs = require('fs');
const path = require('path');
const service = require('../service');
const _ = require('lodash')

module.exports = (server) => {
 
  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
    }
  });

  service.serverSocket = io;

  io.sockets.on('error', err => console.log(err));
  
  io.sockets.on("connection", socket => {
  
    console.log('A user is connected')
    
    socket.on('createRoom', (req) => {
      service.createRoom(req.roomName, req.password, socket);
      socket.join(req.roomName)
    });

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

      const selectedRoom = service.rooms.find(r => r.name === req.roomName);
      if(typeof selectedRoom === "undefined" || selectedRoom === null) return socket.emit('loginFailed', true);
      if(selectedRoom.password !== req.password) return socket.emit('loginFailed', true);
      const selectedUser = selectedRoom.clients.find(c => c.userName === req.userName);

      if(selectedUser) {
        socket.emit('existUser', true);
        return;
      }

      socket.join(req.roomName)
      req.socketId = socket.id;
      selectedRoom.clients.push(req);
      socket.emit('loginSuccessed', true);
      
      io.to(selectedRoom.name).emit("changedRoom", selectedRoom)
      io.to(selectedRoom.name).emit("allRomes", service.rooms)
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
      io.to(roomName).emit('deletedYourRoom', true);
    })

    io.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
    });

    io.of("/").adapter.on("join-room", (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });

    socket.on('disconnect', () => {
      socket.emit('isDisconnected', true);
      
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
      io.to(selectedRoom.name).emit("allRomes", service.rooms)
      console.log('disconnected')
    })
    
  });

  return io;
}

