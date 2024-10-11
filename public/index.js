const socket = io('http://127.0.0.1:3000/')
let socketEndPoint = null
const getByIdElmButtonMsgSend = document.getElementById('msgSend')
const getByIdElmInputMsgContent = document.getElementById('msgContent')
const getByIdElmSpanIsTyping = document.getElementById('idSpanIsTyping')

getByIdElmButtonMsgSend.onclick = (event) => {
    let msg_content = getByIdElmInputMsgContent.value.toString()

    if (msg_content.length > 0) {

        socket.emit('MSG', msg_content)

        // socketEndPoint.emit('MSG', msg_content)

    } else console.log("msg content is to short")
}

getByIdElmInputMsgContent.addEventListener('keypress', ()=>{
    socket.emit('CL_IS_TYPING', "Hi Im Is typing")
})

socket.on("CL_IS_TYPING",(data)=>{
    getByIdElmSpanIsTyping.innerHTML = 'user is typing'
})

function projectItemClick(item) {
    item.onclick = (event) => {
        let itemEndpoint = item.getAttribute("data_endpoint").toString().trim()

        if (itemEndpoint.length > 0) {

            // console.log(itemEndpoint)
            joinNameSpace(itemEndpoint)

        } else console.log("Endpoint is to short")
    }
}

function joinNameSpace(endpoint) {
    if (socketEndPoint) socketEndPoint.close()
    socketEndPoint = io(`http://127.0.0.1:3000${endpoint}`)

    // console.log(endpoint)
    socketEndPoint.on("connect", (data) => {
        console.log("connect")
        // socket.emit('CL_', "HI SERVER")
    })

    socketEndPoint.on("SR_EMIT_PROJECT_ROOMS", (data) => {
        console.log(data.msg)
        const getByIdElmUlRooms = document.getElementById('idUlRooms')
        getByIdElmUlRooms.innerHTML = ''
        data.rooms.forEach((ns) => {
            let liElm = document.createElement('li')
            // list-group-item mb-2 d-flex col-12
            liElm.classList.add('list-group-item', 'mb-2')
            liElm.style.cursor = 'pointer'
            liElm.innerHTML = ns.title
            // liElm.setAttribute("data_endpoint",ns.endpoint)
            // projectItemClick(liElm)
            getByIdElmUlRooms.appendChild(liElm)
            liElm.addEventListener("click", function () {
                // console.log(ns.title)
                if (ns.title.toString().length > 0) {

                    // console.log(itemEndpoint)
                    joinRoom(ns.title)

                } else console.log("room name is to short")
            });


        })

    })
    //
    // socketEndPoint.emit('CL_JOIN_REQ_TO_ENDPOINT', {
    //     msg:`plz join me to this ${endpoint} endpoint`,
    //     endpoint
    // })
}


function joinRoom(name) {
    // itemClick.onclick = (event) => {
    //
    //
    //     if (name.length > 0) {
    // console.log(itemEndpoint)




    socketEndPoint.emit("CL_JOIN_REQ_TO_ROOM", name.toString())


    socketEndPoint.off("SR_EMIT_ROOM_INFO")
    socketEndPoint.off("GET_ONLINE_USERS")
    socketEndPoint.off("SERVER_MSG_RECEIVED")

    socketEndPoint.on("SR_EMIT_ROOM_INFO", (data) => {
        console.log("join on -> " + data.roomInfo)
        // socket.emit('CL_', "HI SERVER")
    })

    socketEndPoint.on("GET_ONLINE_USERS", (data) => {

        const getByIdElmSpanOnlineUsers = document.getElementById('idSpanOnlineUsers')
        getByIdElmSpanOnlineUsers.innerHTML = ''
        getByIdElmSpanOnlineUsers.innerHTML = data.count
        console.log("leave on -> " + data)
        // socket.emit('CL_', "HI SERVER")
    })

    socketEndPoint.on("SERVER_MSG_RECEIVED", (data) => {

        const getByIdElmSpanOnlineUsers = document.getElementById('idSpanOnlineUsers')
        getByIdElmSpanOnlineUsers.innerHTML = ''
        getByIdElmSpanOnlineUsers.innerHTML = data.count
        console.log("leave on -> " + data)
        // socket.emit('CL_', "HI SERVER")
    })
}

socket.on('SERVER_MSG_RECEIVED2', (data) => {
    console.log(data)
    const getByIdElmULChatList = document.getElementById('idChatList')

    // getByIdElmULChatList.innerHTML = ''
    getByIdElmSpanIsTyping.innerHTML = ''
    let liElm = document.createElement('li')
    // list-group-item mb-2 d-flex col-12
    liElm.classList.add('list-group-item', 'mb-2', 'd-flex', 'col-12')
    // liElm.innerHTML = data
    liElm.innerHTML = `
            <span class="col-2 p-2" style="width: 50px; height: 50px; border-radius: 50px; border: 1px solid darkred; background-color: #0d6efd">

            </span>

            <div class="d-flex flex-column ps-2 col-10" >
                <span class="fs-4 text-warning fw-bold">
                    ALI
                </span>
                <div class="d-flex justify-content-between ms-2 col-12 flex-wrap" >

                    <span class="fs-5 text-black-50">
                        ${data}
                    </span>
                    <span class="fs-5 text-black-50">
                        10:55
                    </span>
                </div>
            </div>
        `
    getByIdElmULChatList.appendChild(liElm)

    getByIdElmInputMsgContent.value = ''
})


socket.on("connect", (data) => {

    socket.emit('WL', "HI SERVER")
})
socket.on('WR', (data) => {
    console.log(data)
})



socket.on("disconnect", (reason) => {
    console.log(reason)
    if (reason === "io server disconnect") {
        socket.connect()
    }

})
// new
socket.on("namespaceLoad", (nsData) => {
    const getByIdElmUlProjects = document.getElementById('idUlProjects')
    getByIdElmUlProjects.innerHTML = ''
    nsData.forEach((ns) => {
        let liElm = document.createElement('li')
        // list-group-item mb-2 d-flex col-12
        liElm.classList.add('list-group-item', 'mb-2')
        liElm.style.cursor = 'pointer'
        // liElm.innerHTML = data
        liElm.innerHTML = ns.title
        liElm.setAttribute("data_endpoint", ns.endpoint)

        getByIdElmUlProjects.appendChild(liElm)
        projectItemClick(liElm)

    })
})
// new
socket.on("connect_error", (error) => {
    console.log(error)
    // catch error Middleware this here
})

