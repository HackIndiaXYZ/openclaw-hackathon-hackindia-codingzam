const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { _id: false }
);

const momentumSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    at: { type: Number, required: true },
  },
  { _id: false }
);

const opportunityActionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    action: { type: String, enum: ["saved", "applied", "rejected"], required: true },
    at: { type: Number, required: true },
  },
  { _id: false }
);

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    todos: {
      type: [todoSchema],
      default: [],
    },
    momentum: {
      type: [momentumSchema],
      default: [],
    },
    counters: {
      quickTaskActions: { type: Number, default: 0 },
      mentorContacts: { type: Number, default: 0 },
      bestMatchActions: { type: Number, default: 0 },
      roadmapActions: { type: Number, default: 0 },
      applicationClicks: { type: Number, default: 0 },
    },
    touchedDays: {
      type: [String],
      default: [],
    },
    seniorClicks: {
      type: Map,
      of: Number,
      default: {},
    },
    opportunityActions: {
      type: [opportunityActionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);
