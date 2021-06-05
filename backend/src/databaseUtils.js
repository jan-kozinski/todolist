import mongoose from "mongoose";
import config from "config";
function connectDB() {
  mongoose.connect(config.get("database"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // callback when connection to mongodb is open
  mongoose.connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
  });
}
function dropDatabase() {
  mongoose.connection.collections["todos"].drop();
}
module.exports = { connectDB, dropDatabase };
