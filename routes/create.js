const router = require("express").Router();
const db = require("../config/db");
const to = require("../utils/to");
const {google} = require('googleapis');
const fs = require('fs');
const authorize = require('./auth.js');

exp = {}

const credentialsjson = process.env.credentialsjson;

exp.createMeeting = async(req , res) => {
    let link = req.body.link;
    let start = new Date(req.body.start).toISOString();
    let end = new Date(req.body.end).toISOString();
    console.log(link);
    console.log(start);
    console.log(end);
    let err , result;
    var event = {
        'summary': 'Meeting',
        'location': 'Delhi',
        'description': '30 Minute Meeting',
        'start': {
          'dateTime': start,
          'timeZone': 'Asia/Kolkata',
        },
        'end': {
          'dateTime': end,
          'timeZone': 'Asia/Kolkata',
        },
        'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
          {'email': 'Kapoornitigya@gmail.com'},
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10},
          ],
        },
    };
    [err , auth] = await to (authorize(JSON.parse(credentialsjson)));
    let email = goole.email;
    let  calendar = google.calendar({version: 'v3', auth});
    [err , result] = await to(calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
      }));
    if(err)
      return res.sendError(err);
    return res.sendSuccess("Successfully Created an Event");
};

module.exports = exp;