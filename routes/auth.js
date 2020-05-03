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
      console.log(result[0].token);
      oAuth2Client.setCredentials(JSON.parse(result[0].token));
      resolve(oAuth2Client);
    } catch (error) {
      reject(error);
    }
  });
}


// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }

module.exports = authorize;