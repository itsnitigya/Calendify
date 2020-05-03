const router = require("express").Router();
const db = require("../config/db");
const to = require("../utils/to");
const test = require("./test.js");

router.get("/ping" ,test.ping);

module.exports = router;