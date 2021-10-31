const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    socialLink: String,
    walletAddress: String,
    amount: Number,
    totalPrice: Number,
    selectedCoin: String,
    fee: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    completedAt: Date,
    status: {
      type: Number,
      default: 0
    },
  })
);

module.exports = Order;
