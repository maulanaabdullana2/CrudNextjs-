const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    imageProfile: {
      type: String,
      default:
        "https://ik.imagekit.io/ku9epk6lrv/user%20(1).png?updatedAt=1701280630365",
    },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("Auth", user);

module.exports = User;
