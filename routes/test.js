const router = require("express").Router();
const db = require("../config/db");
const to = require("../utils/to");

let exp = {};

exp.ping = async(req,res) => {
  return res.sendSuccess("pong");
};

module.exports = exp;