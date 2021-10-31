const db = require("../models");
const Rate = db.rate;
const service = require('../service');

exports.create = (req, res) => {

  const rate = new Rate(req.body);
  rate.save((err, rate) => {
    if(err) {
      res.status(500).send(err);
      return;
    }
    service.serverSocket.emit('setRate', rate);
    res.status(200).send(order);
  })

};

exports.getOrder = (req, res) => {
  res.status(200).send("User Content.");
};

exports.getOrders = (req, res) => {
  res.status(200).send("Admin Content.");
};

