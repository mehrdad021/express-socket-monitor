const NameSpaceCtr = require('./NameSpaceCtr')
const RoomCtr = require('./RoomCtr')

let ns1 = new NameSpaceCtr("public",'/public')
let ns2 = new NameSpaceCtr("program",'/program')
let ns3 = new NameSpaceCtr("graphic",'/graphic')
let ns4 = new NameSpaceCtr("game",'/game')

ns1.addRoom(new RoomCtr('p1','pub1'))

ns2.addRoom(new RoomCtr('pg1','pg1'))


ns3.addRoom(new RoomCtr('gr1','gr1'))
ns3.addRoom(new RoomCtr('gr2','gr2'))


ns4.addRoom(new RoomCtr('game','game'))
ns4.addRoom(new RoomCtr('game2','game2'))
ns4.addRoom(new RoomCtr('game3','game3'))


module.exports =[ns1,ns2,ns3,ns4]