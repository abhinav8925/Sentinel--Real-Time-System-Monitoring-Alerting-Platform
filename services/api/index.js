require("dotenv").config();
const http = require("http")
const Alert = require("../../src/models/Alert")
const Metric = require("../../src/models/Metric")
const connectDB = require("../../src/db/db");
connectDB();
const metricQueue = require("../../src/queue/metricQueueRedis");
const {Server} = require("socket.io")
const express = require("express")
const si = require("systeminformation")
const cors = require("cors");
const alertPubSub = require("../../src/queue/alertPubSub")
const { cpuUsage, memoryUsage } = require("process");
const { timeStamp } = require("console");


const app = express();
const PORT = 5000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: "*"}
});


app.use(cors())
app.use(express.json());
app.use(express.static("public"));

app.get("/",(req,res) => {
    res.send("Sentinel Monitoring API is running.")
});

app.get("/metrics", async(req,res) => {
    try {
        const cpuLoad = await si.currentLoad();
        const memory = await si.mem();
        const uptime = await si.time();

        res.json({
            cpuUsage: cpuLoad.currentLoad.toFixed(2) + "%",
            memoryUsage: ((memory.used/memory.total)*100).toFixed(2) + "%",
            totalMemoryGB: (memory.total/1024/1024/1024).toFixed(2),
            timestamp: new Date().toISOString()
         })
    }catch(error){
        res.status(500).json({
            error: "Failed to fetch system metrics."
        });
    }
})

app.get("/alerts",async(req,res) => {
    try{
        const alerts = await Alert.find().sort({createdAt: -1}).limit(50);
        res.json(alerts);
    }catch(error){
        res.status(500).json({error: "Failed to fetch alerts"})
    }
})

app.get("/metrics/history", async(req,res) => {
    try{
        const metrics = await Metric.find()
        .sort({createdAt: -1})
        .limit(100);

        res.json(metrics);
    }catch(err){
        res.status(500).json({
            error: "Failed to fetch metric history"
        })
    }
})

app.delete("/clear/alerts", async(req, res)=>{
    try{
        await Alert.deleteMany({});
        res.json({message: "All alerts cleared."});
    }catch(err){
        res.status(500).json({error: "Failed to clear alerts."})
    }
})

app.delete("/clear/metrics", async(req,res)=>{
    try{
        await Metric.deleteMany({});
        res.json({message: "All metrics cleared"});
    }catch(err){
        res.status(500).json({error: "Failed to clear metrics."})   
    }
})


io.on("connection",(socket)=>{
        console.log("Client connected.", socket.id);
        
        const interval = setInterval(async ()=>{
        try{
            
            const latestMetric = await Metric.findOne().sort({createdAt: -1});
            if(latestMetric){
                socket.emit("metrics", {
                    cpuUsage: latestMetric.cpuUsage,
                    memoryUsage: latestMetric.memoryUsage,
                    timeStamp: latestMetric.createdAt
                });      
            }

        }catch(err){
            console.error("Socker error:", err);
        }
    },2000);
    
    socket.on("disconnect",() =>{
        console.log("Client disconnected: ", socket.id);
        clearInterval(interval);
    })
})


let lastAlertTime = new Date(0);
(async() =>{
    const last = await Alert.findOne().sort({createdAt: -1});
    if(last)    lastAlertTime = last.createdAt;
})();

setInterval(async() =>{
    try{
        const newAlerts = await Alert.find({
            createdAt: {$gt: lastAlertTime}
        }).sort({createdAt: 1});

        if(newAlerts.length > 0){
            lastAlertTime = newAlerts[newAlerts.length - 1].createdAt;
            console.log("Sending LIVE alerts: ", newAlerts.length);
            io.emit("alerts", newAlerts);
        }
    }catch(err){
        console.log("Alert polling error: ",err)
    }
},2000)

server.listen(PORT, ()=>{
    console.log("Sentinel running on", PORT);
})


