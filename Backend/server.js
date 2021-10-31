const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
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

const db = require("./app/models");
const Role = db.role;
const User = db.user;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

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

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'candidater' to roles collection");

        const adminUser = new User({
          username: 'admin',
          email: 'admin@gmail.com',
          password: bcrypt.hashSync("admin12345", 8),
      })
      Role.find(
          {
            name: 'admin'
          },
          (err, roles) => {
            if (err) {
              console.log('Admin user creating has an err.')
              return;
            }
  
            adminUser.roles = roles.map(role => role._id);
            adminUser.save(err => {
              if (err) {
                  console.log('Admin user role creating has an err.')
                return;
              }
  
              console.log('Admin user role creating is sucessed.')
            });
          }
        );
      });

    
    }
  });
}
