require("dotenv").config();
const redis = require("./redisClient");
const CHANNEL = "alerts_channel";

module.exports = {
    async publish(alert){
        await redis.publish(CHANNEL, JSON.stringify(alert));
    },

     subscribe(callback){
        redis.subscribe(CHANNEL, (message) => {
            callback(JSON.parse(message));
        })
    }
};
