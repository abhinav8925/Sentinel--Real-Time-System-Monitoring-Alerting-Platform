require("dotenv").config();
// const {Redis} = require("@upstash/redis")

const redis = require("./redisClient");

const QUEUE_KEY = "metrics_queue";

module.exports = {
        async  enqueue(metric){
            await redis.rpush(QUEUE_KEY,JSON.stringify(metric));
        },

        async  dequeueBatch(size){
            const items = [];

            for(let i=0;i<size;i++){
                const data = await redis.lpop(QUEUE_KEY);
                if(!data)   break;

                try{
                    if(typeof data === "string"){
                        items.push(JSON.parse(data));
                    }else{
                        items.push(data);
                    }
                }catch{
                    console.log("Skipping corrupted queue item:", data)
                }
            }
            return items;
        },

        async size(){
            return await redis.llen(QUEUE_KEY)
        }

}

