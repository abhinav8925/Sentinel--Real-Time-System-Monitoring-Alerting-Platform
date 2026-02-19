const mongoose = require("mongoose");
const metricSchema  = new mongoose.Schema({
    cpuUsage: Number,
    memoryUsage:Number, 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Metric", metricSchema);