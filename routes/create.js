const router = require("express").Router();
const db = require("../config/db");
const to = require("../utils/to");
const {google} = require('googleapis');
const fs = require('fs');
const authorize = require('./auth.js');

exp = {}

const credentialsjson = process.env.credentialsjson;

exp.createMeeting = async(req , res) => { 
    let email = req.body.email;
    let link = req.body.link;
    let start = new Date(req.body.start).toISOString();
    let end = new Date(req.body.end).toISOString();
    let err , result;
    [err , auth] = await to (authorize(JSON.parse(credentialsjson), email));
    if(err)
        return res.sendError(err);
    [err , result] = await to(db.query("insert into meeting values(?,?,?,?)",[link , email , start , end]));
    if(err)
        return res.sendError(err);
    return res.sendSuccess("Successfully created a meeting");
};

exp.bookMeeting = async(req,res) => {
    let link = req.params.link;
    let email = req.body.email;
    let start = new Date(req.body.start).toISOString();
    let end = new Date(req.body.end).toISOString();
    let err , result; 
    [err , result] = await to(db.query("select * from meeting where link = ?" , [link]));
    if(err)
        return res.sendError(err);
    let meeting_email = result[0].email;
    [err , auth] = await to (authorize(JSON.parse(credentialsjson), meeting_email));
    let calendar = google.calendar({version: 'v3', auth});
    [err , result] = await to(calendar.freebusy.query({
        auth : auth,
        headers: { "content-type" : "application/json" },
        calendarId : 'primary',
        resource:{
            items: [
                {"id" : "primary"}
          ],  
        timeMin: start,
        timeMax: end,
        groupExpansionMax: 100,
        calendarExpansionMax:50,
    }   
    }));
    console.log(result.data.calendars.primary.busy);
    if(result.data.calendars.primary == 0)
        return res.sendError("Choose another time");
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
            {'email': email,
             'email': meeting_email
            },
        ],
        'reminders': {
            'useDefault': false,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10},
            ],
        },
    };
    [err , result] = await to(calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
    }));
    if(err)
        return res.sendError(err);
    [err , auth] = await to (authorize(JSON.parse(credentialsjson), email));
    calendar = google.calendar({version: 'v3', auth});
    [err , result] = await to(calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
    }));
    if(err)
        return res.sendError(err);
    res.sendSuccess("Meeting Booked");
};

module.exports = exp;