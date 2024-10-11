
class RoomCtr {

    constructor(title, name) {
        this.title = title
        this.name = name
        this.history = []
    }

    addMsg(msg){
        this.history.push(msg)
    }
}


module.exports = RoomCtr