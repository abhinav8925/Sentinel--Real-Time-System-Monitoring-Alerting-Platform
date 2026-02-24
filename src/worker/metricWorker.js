const metricQueue = require("../queue/metricQueueRedis");
const Metric = require("../models/Metric");

async function startMetricWorker(){
    console.log("Redis metric Worker started...");

    setInterval(async () => {
        try{
            const size = await metricQueue.size();
            console.log("Redis Queue size:", size);

            // console.log("Queue.size:", metricQueue.size())
            const batch = await metricQueue.dequeueBatch(10);

            if(batch.length > 0) {
                await Metric.insertMany(batch);
                console.log(`Saved ${batch.length} from metrics from Redis queue`)
            }
        }catch(err){
            console.log("Worker error: ", err);
        }
    },5000)
}

module.exports = startMetricWorker;