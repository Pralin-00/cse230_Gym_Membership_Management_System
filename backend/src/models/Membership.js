const mongoose = require("mongoose");

// A "Membership" record represents one gym member's plan/subscription.
// Field names line up with the assignment spec (title, description, dueDate,
// isCompleted) but are interpreted for the gym domain:
//   title       -> member name / plan name (e.g. "Alina Gurung - Gold Plan")
//   description -> plan details / notes
//   dueDate     -> the membership's renewal (expiry) date
//   isCompleted -> whether that renewal/payment cycle has been completed
const membershipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title (member name / plan) is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date (renewal date) is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

membershipSchema.index({ owner: 1, dueDate: 1 });

module.exports = mongoose.model("Membership", membershipSchema);
