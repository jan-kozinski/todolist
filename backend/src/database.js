import mongoose from "mongoose";

class Database {
  constructor(dbURI) {
    this.dbURI = dbURI;
  }
  connectDB() {
    if (process.env.NODE_ENV === "test") {
      const { MockMongoose } = require("mock-mongoose");
      let mockMongoose = new MockMongoose(mongoose);
      mockMongoose.prepareStorage().then(() => {
        mongoose.connect(this.dbURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        mongoose.connection.on("connected", () => {
          console.log("mock db connection is now open");
        });
      });
    } else
      mongoose.connect(this.dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

    // callback when connection to mongodb is open
    mongoose.connection.once("open", function () {
      console.log("MongoDB database connection established successfully");
    });
  }
  dropDatabase() {
    mongoose.connection.collections["todos"].drop();
  }
}

module.exports = Database;
