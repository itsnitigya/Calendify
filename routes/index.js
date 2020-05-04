const router = require("express").Router();
const db = require("../config/db");
const to = require("../utils/to");
const test = require("./test.js");
const create = require('./create.js');

router.post("/ping" ,test.ping);
router.post("/create" , create.createMeeting);
router.post("/token" , test.getToken);
router.post("/signup" , test.signup);
router.post("/book/:link" , create.bookMeeting);

module.exports = router;