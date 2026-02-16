const mongoose = require("mongoose");


const connectDB = async() => {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/sentinel");
        console.log("MongoDB Connected");
        
    }catch(error){
        console.error("MongoDB Connecrion Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;