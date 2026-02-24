require("dotenv").config();
const connectDB = require("../../src/db/db");
const startMetricWorker = require("../../src/worker/metricWorker");

connectDB();
console.log("Worker Service Started ... ");

startMetricWorker();