const express = require("express");
const Insight = require("../models/Insight");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Helper to format timestamp
const formatTimestamp = (date) =>
  new Date(date).toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });

// Save a new insight
router.post("/", auth, async (req, res) => {
  const { mood } = req.body;
  const insight = new Insight({ user: req.userId, mood });
  await insight.save();

  const formattedInsight = {
    ...insight.toObject(),
    timestamp: formatTimestamp(insight.date),
  };

  res.status(201).json(formattedInsight);
});

// Get insights for logged-in user
router.get("/", auth, async (req, res) => {
  const insights = await Insight.find({ user: req.userId }).sort({ date: -1 });

  const formattedInsights = insights.map((insight) => ({
    ...insight.toObject(),
    timestamp: formatTimestamp(insight.date),
  }));

  res.json(formattedInsights);
});

module.exports = router;
