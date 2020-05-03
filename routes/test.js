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
  //console.log(result);
  return res.sendSuccess("pong");
};

var event = {
  'summary': 'Google I/O 2015',
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'start': {
    'dateTime': '2015-05-28T09:00:00-07:00',
    'timeZone': 'America/Los_Angeles',
  },
  'end': {
    'dateTime': '2015-05-28T17:00:00-07:00',
    'timeZone': 'America/Los_Angeles',
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=2'
  ],
  'attendees': [
    {'email': 'lpage@example.com'},
    {'email': 'sbrin@example.com'},
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10},
    ],
  },
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

exp.signup = async(req, res) => {
  let err,result;
  let email = req.body.email;
  let token = JSON.stringify({"access_token":"ya29.a0Ae4lvC2AzQpQSKhYnfBKPp0Mv_rmOcTU8XRYxpyTjBlpO4x3rh5UVOAT6sK64Iwm_zMlXD4vSlPZsLKvGCSbC_RliEmbYMy503jiTgPlNoOQ1fOS5mwg0-v5aevckw0uzRI5dtEhFKdghjmjSlk4Wiexhm2zVEUF3g0","refresh_token":"1//0gT5i_NaPVYFcCgYIARAAGBASNwF-L9Ir9sRq_NmBA7uhG3UmXjb-rFxy6NB7bHFCs-tGrgJTmv8_YP50UfIayfwlcZRbQ09EdEo","scope":"https://www.googleapis.com/auth/calendar","token_type":"Bearer","expiry_date":1588428944817});
  [err , result] = await to(db.query("insert into users values(?,?)" , [email,token]));
  if(err)
    return res.sendError(err);
  res.sendSuccess("added user in db");
};

module.exports = exp;