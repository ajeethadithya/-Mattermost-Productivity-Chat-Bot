// const prompt = require('prompt-sync')();


const {google} = require('googleapis');
require('dotenv').config();

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
//const calendarId = process.env.CALENDAR_ID;
const calendarId= "07dbffq7e548smbqs37bkoru70@group.calendar.google.com";
// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);
// let eventId = 'm8ispit4tg7qib6d7s6slve07o';


// Get date-time string for calender
const dateTimeForCalander = () => {

    let event = '2022-03-30T19:46:00.000Z';
    let startDate = event;
    // Delay in end time is 1
    // let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));
    let endDate = '2022-03-31T19:46:00.000Z';

    return {
        'start': startDate,
        'end': endDate
    }
};

//console.log(dateTimeForCalander())

//let dateTime = dateTimeForCalander();

const prompt = require('prompt-sync')();

const name = prompt('What is the event name?');
console.log(`Event name is  ${name}`);

const desc = prompt('What is the desc?');
console.log(`Event desc is  ${desc}`);

 const start = prompt('What is your start?');
console.log(`Event name is  ${start}`);

const end = prompt('What is the end?');
console.log(`Event desc is  ${end}`);



//********************************
// Event for Google Calendar - Hardcoding event details for testing purposes.
let event = {


    'summary': name, 
    'description': desc,
    'start': {
        // 'dateTime': dateTime['start'],
        'dateTime': start,
        'timeZone': 'America/New_York'
    },
    'end': {
        'dateTime': end,
        'timeZone': 'America/New_York'
    }
};

    
// Create new event to Google Calendar
const createcalEvent = async (event,description,start,end) => {

    try {
    // Event for Google Calendar - Hardcoding event details for testing purposes.

        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
		console.log("Event was successfully created");
        } else {
            // return 0;
		console.log("Failed to set up meeting");
        }
    } catch (error) {
        console.log(`Check Create calendar event function (Create event) ${error}`);
        return 0;
    }
};



createcalEvent(event)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });



//Get all the events between two dates
const getEvents = async (dateTimeStart, dateTimeEnd) => {

    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'America/New_York'
        });
    
        let items = response['data']['items'];
        return items;
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
};

//let start = '2022-03-22T19:46:00.000Z';
//let end = '2022-03-24T20:46:00.000Z';

getEvents(start, end)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });

// //Delete an event from eventID
// const deleteEvent = async (eventId) => {

//     try {
//         let response = await calendar.events.delete({
//             auth: auth,
//             calendarId: calendarId,
//             eventId: eventId
//         });

//         if (response.data === '') {
//         console.log("Event was successfully deleted");
//             //return 1;
//         } else {
//         console.log("Event Deletion Failed");
//             //return 0;
//         }
//     } catch (error) {
//         console.log(`Error at deleteEvent --> ${error}`);
//         return 0;
//     }
// };

// deleteEvent(eventId)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
