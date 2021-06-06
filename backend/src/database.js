import mongoose from "mongoose";

class Database {
  constructor(dbURI) {
    this.dbURI = dbURI;
  }
  connectDB() {
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
