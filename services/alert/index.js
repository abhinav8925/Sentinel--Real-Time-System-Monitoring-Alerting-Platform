require("dotenv").config();
const connectDB = require("../../src/db/db");
const Metric = require("../../src/models/Metric");
const Alert = require("../../src/models/Alert")
const alertPubSub = require("../../src/queue/alertPubSub")

connectDB();

console.log("Alert Engine Service Started");

const CPU_THRESHOLD = 80;
const MEMORY_THRESHOLD = 85;
const COOLDOWN_MS = 30000;

let lastAlertTime = {
    CPU_HIGH:0,
    MEMORY_HIGH:0
};

let lastState = {
    cpuHigh: false,
    memoryHigh: false
};

setInterval(async () => {
    try {
        const latest = await Metric.findOne().sort({createdAt: -1});
        if(!latest) return;

        // const now = Date.now();
        const alerts=[];

        if(latest.cpuUsage > CPU_THRESHOLD && !lastState.cpuHigh ){
            alerts.push({
                type: "CPU_HIGH",
                message: `CPU usage high: ${latest.cpuUsage}%`,
                severity: "CRITICAL",
                cpuUsage: latest.cpuUsage,
                memoryUsage:latest.memoryUsage
            });
            lastState.cpuHigh = true;
        }

        if(latest.cpuUsage <= CPU_THRESHOLD){
            lastState.cpuHigh = false;
        }

        if(latest.memoryUsage > MEMORY_THRESHOLD && !lastState.memoryHigh){
            alerts.push({
                type: "MEMORY_HIGH",
                message: `Memory usage high: ${latest.memoryUsage}%`,
                severity: "CRITICAL",
                cpuUsage: latest.cpuUsage,
                memoryUsage:latest.memoryUsage
            });
            lastState.memoryHigh = true;
        }

        if(latest.memoryUsage <= MEMORY_THRESHOLD){
            lastState.memoryHigh = false;
        }

        if(alerts.length >0){
            await Alert.insertMany(alerts);
            // for(const alert of alerts) {
            //  await alertPubSub.publish(alert);
            // }    
            console.log("Alerts Generated", alerts);
        }
    }catch(err){
        console.log("Alert Engine Error: ",err);
    }
},5000)