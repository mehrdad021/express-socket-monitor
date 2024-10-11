// const io = require('./www');
const structure = require('../chat/structure')


// const io = new Server(httpServer,{
//     cors:{
//         origin: '*'
//     }
// })
const EVENT_REQ = {
    CL_JOIN_REQ_TO_ENDPOINT: "CL_JOIN_REQ_TO_ENDPOINT",
    CL_JOIN_REQ_TO_ROOM: "CL_JOIN_REQ_TO_ROOM",
    CL_JOIN_REQ_GET_ENDPOINT: "CL_JOIN_REQ_GET_ENDPOINT",
    CL_IS_TYPING: "CL_IS_TYPING",
}
const EVENT_RES = {
    SR_EMIT_PROJECT_ROOMS: "SR_EMIT_PROJECT_ROOMS",
    SR_EMIT_ROOM_INFO: "SR_EMIT_ROOM_INFO",
    GET_ONLINE_USERS: "GET_ONLINE_USERS",
}
const BASE_EVENT = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    DISCONNECTING: "disconnecting",
}
module.exports = class ServerIO {

    constructor(io) {
        this.io = io

        this.useMiddleware()
        this.onListen()
    }

    onListen() {
        this.io.on(BASE_EVENT.CONNECTION, (client) => {
            console.log("ON_CONNECTION")
            let nsData = structure.map((namespace) => {
                return {
                    title: namespace.title,
                    endpoint: namespace.endpoint,
                }
            })

            client.emit('namespaceLoad', nsData)

            client.on(BASE_EVENT.DISCONNECT, () => {
                console.log('disconnect')
            });
            client.on(EVENT_REQ.CL_IS_TYPING, () => {
                client.broadcast.emit(EVENT_REQ.CL_IS_TYPING, "Hi Im Is typing")
            });

            client.on("WL", (data) => {
                console.log(data)
                client.emit('WR', "HI CLIENT")
            })

            client.on("MSG", (data) => {

                client.emit('SERVER_MSG_RECEIVED2', `you say to server -> ${data}`)
            })
        });

        structure.forEach((ns) => {

            this.io.of(ns.endpoint).on(BASE_EVENT.CONNECTION, (nsClient) => {
                console.log("CONNECT TO ep ->" + ns.endpoint)

                nsClient.emit(EVENT_RES.SR_EMIT_PROJECT_ROOMS, {
                    rooms: ns.rooms,
                    msg: "you req to join ep -> " + ns.endpoint
                })

                nsClient.on(EVENT_REQ.CL_JOIN_REQ_TO_ROOM, (roomName) => {
                    console.log(roomName)

                    let lastRoom = ServerIO.setToArray(nsClient.rooms)[1]
                    if (lastRoom) {
                        nsClient.leave(lastRoom)
                        this.getOnlineUsers(ns.endpoint, lastRoom)
                    }


                    nsClient.join(roomName)
                    this.getOnlineUsers(ns.endpoint, roomName)
                    const roomInfo = ns.rooms.find((room) => {
                        return room.name === roomName
                    })

                    nsClient.emit(EVENT_RES.SR_EMIT_ROOM_INFO, {roomInfo})
                })

                nsClient.on("MSG", (data) => {
                    let currentRoomName = ServerIO.setToArray(nsClient.rooms)[1]
                    let msgObject = {
                        username: 'HOSSEIN',
                        avatar: '',
                        content: data,
                        time: new Date().toLocaleString(),
                    }
                    const roomInfo = ns.rooms.find((room) => {
                        return room.name === currentRoomName
                    })
                    roomInfo.addMsg(msgObject)
                    this.io.of(ns.endpoint).in(currentRoomName).emit('SERVER_MSG_RECEIVED',msgObject)
                    // nsClient.emit('SERVER_MSG_RECEIVED', `you say to server -> ${data}`)
                })

                nsClient.on(BASE_EVENT.DISCONNECTING, () => {
                    console.log('DISCONNECTING of endpoint')
                    let lastRoom = ServerIO.setToArray(nsClient.rooms)[1]
                    if (lastRoom) {
                        nsClient.leave(lastRoom)
                        this.getOnlineUsers(ns.endpoint, lastRoom)
                    }

                });
            })


        })
    }

    // leaveOfRoom(clientSocket){
    //     let lastRoom = ServerIO.setToArray(nsClient.rooms)[1]
    //     if(lastRoom) {
    //         nsClient.leave(lastRoom)
    //         this.getOnlineUsers(ns.endpoint,lastRoom)
    //     }
    // }

    useMiddleware() {
        this.io.use((client, next) => {
            next()
        });
    }

    async getOnlineUsers(endPoint, roomName) {
        const allMembers = await this.io.of(endPoint).in(roomName).allSockets()
        this.io.of(endPoint).in(roomName).emit(EVENT_RES.GET_ONLINE_USERS,
            {
                count: ServerIO.setToArray(allMembers).length
            }
        )
    }

    static setToArray(sets) {
        return Array.from(sets)
    }

    getIoClient() {
        // return
    }
}
