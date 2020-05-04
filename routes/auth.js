const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const db = require("../config/db");
const to = require("../utils/to");

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'routes/token.json';

const tokenjson = process.env.tokenjson;

async function authorize(credentials , email) {
  return new Promise(async function (resolve, reject) {
    try {
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
      let err, result;
      [err, result] = await to(db.query('select * from users where email = ?',[email]));
      oAuth2Client.setCredentials(JSON.parse(result[0].token));
      resolve(oAuth2Client);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = authorize;