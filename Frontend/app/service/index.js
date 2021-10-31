
class Service {

    constructor() {
        this.users = [];
        this.getSocketById = {};
        this.getIdBySocket = {};
        this.serverSocket = null;
        this.rateDisplayMode = false;
        this.rooms = [];
        this.isStop = false;
    }
    
    createRoom(name, password, socket) {
        this.rooms.push({
            name,
            password,
            clients: [],
            adminSocketId: socket.id
        })

        socket.emit('allRomes', this.rooms)
    }

    removeRoom(roomName) {
        this.rooms = this.rooms.filter(r => r.name !== roomName);
        this.serverSocket.emit('allRomes', this.rooms)
    }

    removeClient(roomName, clientName) {

    }

    logout(user) {
        this.users = this.users.map(u => !u.ID === user.ID);
    }

}

module.exports = new Service();