const http = require("http")
const Alert = require("./src/models/Alert")
const connectDB = require("./src/db/db");
connectDB();
const startMetricWorker = require("./src/worker/metricWorker");;
startMetricWorker();
const {Server} = require("socket.io")
const express = require("express")
const si = require("systeminformation")
const cors = require("cors");
const { cpuUsage, memoryUsage } = require("process");
const { timeStamp } = require("console");
const Metric = require("./src/models/Metric")
const metricQueue = require("./src/queue/metricQueue");


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


io.on("connection",(socket)=>{
        console.log("Client connected.", socket.id);

        const  lastAlertTime = {
            CPU_HIGH:0,
            MEMORY_HIGH:0
        };

        const COOLDOWN_MS = 30000;
        const CPU_THRESHOLD = 15;
        const MEMORY_THRESHOLD = 75;

        const interval = setInterval(async ()=>{
        try{
            const cpuLoad = await si.currentLoad();
            const mem = await si.mem();

            const cpu = Number(cpuLoad.currentLoad.toFixed(2));
            const memory = Number(((mem.used/mem.total)*100).toFixed(2));
            
            const now = Date.now();

            const metricData = {
                cpuUsage: cpu,
                memoryUsage: memory,
                createdAt: new Date()
            }

            socket.emit("metrics", {
                cpuUsage: cpu,
                memoryUsage: memory,
                timeStamp: new Date()
            });      
            
            metricQueue.enqueue({
                metricData
            })

            const alerts = []
      
            if(cpu > CPU_THRESHOLD && now-lastAlertTime.CPU_HIGH > COOLDOWN_MS){
                    alerts.push({
                        type: "CPU_HIGH",
                        message: `CPU usage is critically high. ${cpu}%`,
                        severity: "CRITICAL",
                        time: new Date()
                    })
                    lastAlertTime.CPU_HIGH = now;
            }

            if(memory > MEMORY_THRESHOLD && now - lastAlertTime.MEMORY_HIGH > COOLDOWN_MS){
                    alerts.push({
                        type: "MEMORY_HIGH",
                        message: `Memory usage is critically high: ${memory}%`,
                        severity: "CRITICAL",
                        time: new Date()
                    })

                    lastAlertTime.MEMORY_HIGH=now;
            }

        if(alerts.length > 0){
            console.log("Savig alerts: ", alerts);
            for(const alert of alerts){
                await Alert.create({
                    type: alert.type,
                    message: alert.message,
                    severity: alert.severity,
                    cpuUsage: cpu,
                    memoryUsage: memory
                });
            }
            socket.emit("alerts", alerts)
            }
        }catch(err){
            console.error("Monitoring error:", err);
        }
    },2000);
    
    socket.on("disconnect",() =>{
        console.log("Client disconnected: ", socket.id);
        clearInterval(interval);
    })
})


server.listen(PORT, ()=>{
    console.log("Sentinel running on", PORT);
})