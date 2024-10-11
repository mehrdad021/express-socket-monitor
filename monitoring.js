const cluster = require('node:cluster')
const net = require('node:net')
const os = require('os');
const countCPUsCore = os.cpus().length;
const process = require('node:process');
const express = require('express');
const fHash = require('farmhash')
const path = require('path');
const socketIo = require('socket.io');
const { createClient } =require ("redis");
const { createAdapter }= require ("@socket.io/redis-adapter");
const indexRouter = require("./routes");
const ioHandler = require("./bin/IoServerMonitor");


if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid} is running`);

    let workers = []

    let spawnWorker = function (i) {
        // Fork workers.
        workers[i] = cluster.fork()
        workers[i].on('exit', (code, signal) => {
            spawnWorker(i)
            if (signal) {
                console.log(`worker was killed by signal: ${signal}`);
            } else if (code !== 0) {
                console.log(`worker exited with error code: ${code}`);
            } else {
                console.log('worker success!');
            }
        })
    }

    for (let i = 0; i < countCPUsCore; i++) {
        spawnWorker(i)
    }

    let getWorkerIndex = function (ip) {
        const ipHash = fHash.fingerprint32(ip)
        const divOnCpuCores = ipHash % countCPUsCore

        console.log("IP_HASH : " + ipHash + " DIV : " + divOnCpuCores)
        return divOnCpuCores
        // return fHash.fingerprint32(ip) % countCPUsCore
    }

    net.createServer({pauseOnConnect:true}, (connection)=>{
        console.log('client connected');
        connection.on('end', () => {
            console.log('client disconnected');
        });

        let workerIndex = workers[getWorkerIndex(connection.remoteAddress)]

        workerIndex.send('sticky-session:connection',connection)

    }).listen(3000)



} // end cluster.isPrimary

else {
    const app = express();
    const serverApp = app.listen(0,'localhost')
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('view engine', 'ejs');
    // app.get('/',(req,res)=>{
    //     res.send("HELLO MONITORING")
    // })


    const pubClient = createClient({ url: "redis://localhost:6379" });
    const subClient = pubClient.duplicate();

    // await Promise.all([
    //     pubClient.connect(),
    //     subClient.connect()
    // ]);
    (async () => {
        try {
            await pubClient.connect()
            await subClient.connect()
        } catch (e) {

            console.log(e)
        }
        // `text` is not available here
    })();
    const io = socketIo(serverApp,{
        cors:{
            origin:'*'
        },
        adapter: createAdapter(pubClient, subClient)
    })

    ioHandler(io)
    // io.adapter(socketRedis({host:'localhost'}))
    app.use('/', indexRouter);
    process.on('message', (message, connectionApp)=>{
        if (message !=='sticky-session:connection') return false

        serverApp.emit('connection', connectionApp)


        connectionApp.resume()
    })
}