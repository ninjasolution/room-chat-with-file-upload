const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const cors = require("cors");
var bcrypt = require("bcryptjs");
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

console.log(results);
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
require("./app/routes/file.routes")(app);

const server = http.createServer(app);
const io = require('./app/socket')(server);
// set port, listen for requests
const PORT = process.env.PORT || 6430;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
