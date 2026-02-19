const metricQueue = require("../queue/metricQueue");
const Metric = require("../models/Metric");

async function startMetricWorker(){
    console.log("Metric Worker started...");

    setInterval(async () => {
        try{
            const batch = metricQueue.dequeueBatch(10);

            if(batch.length === 0) return;
            await Metric.insertMany(batch);
            console.log(`Saved ${batch.length} from metrics from queue`)
        }catch(err){
            console.log("Worker error: ", err);
        }
    },5000)
}

module.exports = startMetricWorker;