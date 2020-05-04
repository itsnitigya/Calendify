const router = require("express").Router();
const db = require("../config/db");
const to = require("../utils/to");
const {google} = require('googleapis');
const fs = require('fs');
const authorize = require('./auth.js');
const readline = require('readline');

let exp = {};

const credentialsjson = process.env.credentialsjson;

exp.ping = async (req,res) => {
  let err, auth, result;
  let email = req.body.email;
  [err , auth] = await to (authorize(JSON.parse(credentialsjson),email));
  const calendar = google.calendar({version: 'v3', auth});
  [err , result] = await to(calendar.calendarList.list({
    auth: auth,
    maxResults: 100
  },
  ));
  for(var k = 0 ; k < result.data.items.length ; k++){
    var obj = result.data.items[k];
     if(obj.primary){
       console.log(obj.id);
     }
  }
  [err , result] = await to(listEvents(auth));
  return res.sendSuccess("pong");
};

async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  let err , result; 
  [err , result] = await to(calendar.freebusy.query({
    auth : auth,
    headers: { "content-type" : "application/json" },
    calendarId : 'primary',
    resource:{
          items: [
            {"id" : "primary"}
          ],  
          timeMin: "2015-05-27T09:00:00-07:00",
          timeMax: "2015-05-28T17:00:00-07:00",
          groupExpansionMax: 100,
          calendarExpansionMax:50,
  }   
  }));
  return result;
}

exp.getToken = async(req, res) => {
  let err, result;
  const SCOPES = ['https://www.googleapis.com/auth/calendar'];
  let credentials = JSON.parse(process.env.credentialsjson);
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]
  );
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(JSON.stringify(token));
      console.log(JSON.stringify(token));
    });
  });
  return res.sendSuccess(true);
};

//need to redirect get Token after recieving the token in the signup page from frontend 

exp.signup = async(req, res) => {
  let err,result;
  let email = req.body.email;
  //very bad of recieving tokens
  let token = 'token here';
  [err , result] = await to(db.query("insert into users values(?,?)" , [email,token]));
  if(err)
    return res.sendError(err);
  res.sendSuccess("added user in db");
};

module.exports = exp;