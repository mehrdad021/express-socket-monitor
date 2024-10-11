const os = require('os')
const ioClient = require('socket.io-client')


const io = ioClient("http://localhost:3000")

io.on("connect", () => {
    console.log('I Connect To server')

    // let count = 0
    setInterval(async () => {
        // console.log("COUNT : " + count)
        // console.log(await getSysInfo())
        // console.log("\n")
        io.volatile.emit("clientDescInfo" , await getSysInfo())
        // count++
    }, 1000)

    // setInterval( () => {
    //     // console.log("COUNT : " + count)
    //     // console.log(await getSysInfo())
    //     // console.log("\n")
    //     getSysInfo().then((data)=>{
    //         io.emit("clientDescInfo" ,data )
    //     })
    //
    //     count++
    // }, 1000)

})

function getNetInfo(net) {
    for (let key in net) {
        for (let value of net[key]) {
            if (value.internal === false && value.family === 'IPv4') {
                return {
                    osIp: value.address,
                    osMac: value.mac
                }
            }
        }
    }
}

function toGigabit(number) {
    return number / 1024 / 1024 / 1024
}

function toPercent(num1, num2) {
    return num1 * 100 / num2
}

function cpuAvg(cpus) {

    let timeTotal = 0
    let timeIdle = 0

    for (let cpu of cpus) {
        for (let key in cpu.times) {
            if (cpu.times.key !== "idle") {
                // console.log( cpu.times[key])
                timeTotal += cpu.times[key]
            }

        }
        timeIdle += cpu.times.idle

        // console.log(cpu.times)
    }
    return {
        timeTotal: timeTotal / cpus.length,
        timeIdle: timeIdle / cpus.length
    }
}

function cpuLoad(timeMSecond) {


    return new Promise((resolve, reject) => {

        let cpuStartTime = cpuAvg(os.cpus())


        setTimeout(() => {
            let cpuEndTime = cpuAvg(os.cpus())

            let cpuTotalTime = cpuEndTime.timeTotal - cpuStartTime.timeTotal
            let cpuIdleTime = cpuEndTime.timeIdle - cpuStartTime.timeIdle

            let cpuUseFinalTime = cpuTotalTime - cpuIdleTime
            resolve(Math.floor(cpuUseFinalTime * 100 / cpuTotalTime))
        }, timeMSecond)
    })
}

// function getSysInfo() {
//     return new Promise(async (resolve, reject) => {
//         const osType = os.type()
//
//         const osNet = os.networkInterfaces()
//         const osMemTotal = toGigabit(os.totalmem())
//         const osMemFree = toGigabit(os.freemem())
//         const osMemUsage = osMemTotal - osMemFree
//         const osMemUsagePercent = toPercent(osMemUsage, osMemTotal)
//         const {osIp, osMac} = getNetInfo(osNet)
//
//         const osCpus = os.cpus()
//         const osCpuModel = osCpus[0].model
//         const osCpuSpeed = osCpus[0].speed
//         const osCpuCors = osCpus.length / 2
//
//         const osCPUUsagePercent = await cpuLoad( 500)
//
//         resolve({
//             osType,
//             osMemTotal,
//             osMemFree,
//             osMemUsage,
//             osMemUsagePercent,
//             osMac,
//             osIp,
//             osCpuModel,
//             osCpuSpeed,
//             osCpuCors,
//             osCPUUsagePercent,
//         })
//     })
// }

async function getSysInfo() {
    const osType = os.type()

    const osNet = os.networkInterfaces()
    const osMemTotal = toGigabit(os.totalmem())
    const osMemFree = toGigabit(os.freemem())
    const osMemUsage = osMemTotal - osMemFree
    const osMemUsagePercent = Math.round(toPercent(osMemUsage, osMemTotal))
    const {osIp, osMac} = getNetInfo(osNet)
    const osCpus = os.cpus()
    const osCpuModel = osCpus[0].model
    const osCpuSpeed = osCpus[0].speed
    const osCpuCors = osCpus.length / 2

    const osCPUUsagePercent = await cpuLoad(500)


    return {
        osType,
        osMemTotal,
        osMemFree,
        osMemUsage,
        osMemUsagePercent,
        osMac,
        osIp,
        osCpuModel,
        osCpuSpeed,
        osCpuCors,
        osCPUUsagePercent,
    }
}


