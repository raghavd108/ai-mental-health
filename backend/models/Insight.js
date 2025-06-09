const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mood: String,
  date: { type: Date, default: Date.now },
  timestamp: {
    type: String,
    default: () =>
      new Date().toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }),
  },
});

module.exports = mongoose.model("Insight", insightSchema);
