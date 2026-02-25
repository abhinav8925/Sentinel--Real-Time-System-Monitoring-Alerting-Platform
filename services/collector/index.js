require("dotenv").config();
const si = require("systeminformation");
const metricQueue = require("../../src/queue/metricQueueRedis");

console.log("Collector service started.")

setInterval(async() =>{
    try{
        const cpuLoad = await si.currentLoad();
        const mem = await si.mem();

        const metricData = {
            cpuUsage: Number(cpuLoad.currentLoad.toFixed(2)),
            memoryUsage: Number(((mem.used/mem.total)*100).toFixed(2)),
            createdAt: new Date(),
        };
        await  metricQueue.enqueue(metricData);
        const istTime = new Date().toLocaleString("en-IN",{
            timezone: "Asia/Kolkata"
        })
        console.log("Collected Metric @IST: ",istTime)
        console.log(metricData);
    }catch(err){
        console.log("Collector error: ", err)
    }
},10000)