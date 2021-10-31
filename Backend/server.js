const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const cors = require("cors");
var bcrypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/rate.routes")(app);
require("./app/routes/file.routes")(app);

const server = http.createServer(app);
const io = require('./app/socket')(server);
// set port, listen for requests
const PORT = process.env.PORT || 6430;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
