require('custom-env').env(true);
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const url = process.env.MONGO_URL || "mongodb://localhost:27017/chat";

const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false  });

module.exports = connect;
