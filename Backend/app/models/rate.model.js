const mongoose = require("mongoose");

const Order = mongoose.model(
  "Rate",
  new mongoose.Schema({
    usdToVnd: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
  })
);

module.exports = Order;
