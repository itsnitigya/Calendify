const router = require("express").Router();
const db = require("../config/db");
const to = require("../utils/to");
const {google} = require('googleapis');
const fs = require('fs');
const authorize = require('./auth.js');

let exp = {};

const credentialsjson = process.env.credentialsjson;

exp.ping = async (req,res) => {
  let err, auth, result;
  [err , auth] = await to (authorize(JSON.parse(credentialsjson)));
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




module.exports = exp;