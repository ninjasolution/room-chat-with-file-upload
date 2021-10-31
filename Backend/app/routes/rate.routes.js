const { authJwt } = require("../middlewares");
const controller = require("../controllers/order.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/rate", [authJwt.verifyToken], controller.create);

  app.get(
    "/api/rates",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.getOrders
  );

  app.get(
    "/api/rate/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getOrder
  );
};
