const db = require("../models");
const Order = db.order;
const service = require('../service');

exports.create = (req, res) => {

  const order = new Order(req.body);
  order.save((err, order) => {
    if(err) {
      res.status(500).send(err);
      return;
    }
    service.serverSocket.emit('newOrder', order);
    res.status(200).send(order);
  })

};

exports.getOrder = (req, res) => {
  res.status(200).send("User Content.");
};

exports.getOrders = (req, res) => {
  res.status(200).send("Admin Content.");
};

