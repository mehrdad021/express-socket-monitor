module.exports = function (io) {

    io.on('connection', (socket) => {


        socket.on('clientDescInfo', (data) => {


            data.id = socket.osMac.toString().replaceAll(":","")

            io.to('RoomMonitoring').emit('computerDate', data)
        })

        socket.on('joinRoomMonitoring', () => {

           socket.join('RoomMonitoring')
        })
    })
}