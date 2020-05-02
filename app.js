const path = require("path");
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
// const redis = require('redis');
// const redisStore = require('connect-redis')(session);
// const client = redis.createClient();
const response = require("./utils/response");

const app = express();
const server = require("http").Server(app);

const routes = require("./routes");

app.use(
  session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    // store: new redisStore ({ 
    //   host: process.env.REDIS_HOST || 'localhost',
    //   port: process.env.REDIS_PORT || 6379,
    //   client: client,
    //   ttl: 604800
    // }),
    cookie: {
      maxAge: 6044800
    }
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(response);

app.use("/",routes);

const port = process.env.PORT || 3000;

server.listen(port, err => {
  console.log(err || `Listening on port ${port}`);
});

//gracefully exit the app
process
  .on("exit", code => {
    process.exit(code);
  })
  .on("SIGINT", () => {
    process.exit(0);
});

