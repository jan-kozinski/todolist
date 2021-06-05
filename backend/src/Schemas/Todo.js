import mongoose from "mongoose";

let todo = new mongoose.Schema({
  description: String,
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Todo", todo, "todos");
