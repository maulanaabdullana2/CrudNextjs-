const mongoose = require("mongoose");

const cars = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    merek: {
      type: String,
    },
    year: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);
const Car = mongoose.model("Car", cars);

module.exports = Car;
