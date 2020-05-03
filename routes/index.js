const router = require("express").Router();
const db = require("../config/db");
const to = require("../utils/to");
const test = require("./test.js");
const create = require('./create.js');

router.get("/ping" ,test.ping);
router.post("/create" , create.createMeeting);

module.exports = router;