const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect(
    "mongodb://192.168.99.101:27017/noderest",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
    },
    (err) => {
        if (!err) {
            console.log("MongoDB Connection Succeeded.");
        } else {
            console.log("Error in DB connection: " + err);
        }
    }
);

module.exports = mongoose;
