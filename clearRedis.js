const redis = require("../sentinel-monitoring-system/src/queue/redisClient");

(async ()=> {
    await redis.del("metrics_queue");
    console.log("Redis queue cleared.")
    process.exit();
})();