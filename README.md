# Calendify

This is a basic implementation of a calendar booking app.

2 routes - 

/createMeeting :

when user wants to create a meeting its just a simple form with link of their choice , start and end time.

/bookMeeting/:link :

other user visits the link and can choose a time slot for meetings , then a free busy query to check between those slots , if free meeting is booked and added on calanders of both users
(better implementation is get the calander list between the slot and then user can choose a slot)

Duplicate link can be checked using bloom filters (not implemented)
