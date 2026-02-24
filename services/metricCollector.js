const si = require("systeminformation");
const metricQueue = require("../queue/metricQueue");

function startMetricCollector(){
    console.log("Metric Collector Started...");

    setInterval(async() => {
        try{
            const cpuLoad = await si.currentLoad();
            const mem = await si.mem();

            const cpu = Number(cpuLoad.currentLoad.toFixed(2));
            const memory = Number(((mem.used/mem.total)*100).toFixed(2));

            const metricData = {
                cpuUsage: cpu,
                memoryUsage: memory,
                createdAt: new Date()
            };
            metricQueue.enqueue(metricData);
            console.log("Metric collected: ", metricData);
        }catch(err){
            console.error("Collector error: ",err)
        }
    },2000)
}
module.exports = startMetricCollector;