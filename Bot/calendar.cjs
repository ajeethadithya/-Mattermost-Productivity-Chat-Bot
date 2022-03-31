
// const prompt = require('prompt-sync')();


const {google} = require('googleapis');
require('dotenv').config();

// Credentials read using JSON Parse
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
//const calendarId = process.env.CALENDAR_ID;
//Hardcoded for testing purposes
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
// const dateTimeForCalander = () => {

//     let event = '2022-03-30T19:46:00.000Z';
//     let startDate = event;
//     // Delay in end time is 1
//     // let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));
//     let endDate = '2022-03-31T19:46:00.000Z';

//     return {
//         'start': startDate,
//         'end': endDate
//     }
// };

//console.log(dateTimeForCalander())

//let dateTime = dateTimeForCalander();

const prompt = require('prompt-sync')();

// const name = prompt('What is the event name?');
// console.log(`Event name is  ${name}`);

// const desc = prompt('What is the desc?');
// console.log(`Event desc is  ${desc}`);

//  const start = prompt('What is your start?');
// console.log(`Event name is  ${start}`);

// const end = prompt('What is the end?');
// console.log(`Event desc is  ${end}`);



//********************************
// Event for Google Calendar - Hardcoding event details for testing purposes.
function defaultOptions(event_name,desc,start,end)
{
    let event = {
            'summary': event_name, 
            'description': desc,
            'start': {
                'dateTime': start,
                'timeZone': 'America/New_York'
            },
            'end': {
                'dateTime': end,
                'timeZone': 'America/New_York'
            }
        };
    return event;
}


    
// Create new event to Google Calendar
const createcalEvent = async (event_name,desc,start,end) => {

    try {
    // Event for Google Calendar - Hardcoding event details for testing purposes.

        // event = {


        //     'summary': event_name, 
        //     'description': desc,
        //     'start': {
        //         'dateTime': start,
        //         'timeZone': 'America/New_York'
        //     },
        //     'end': {
        //         'dateTime': end,
        //         'timeZone': 'America/New_York'
        //     }
        // };

        let event = defaultOptions(event_name,desc,start,end);	

        // let response = calendar.events.insert({
        //     auth: auth,
        //     calendarId: calendarId,
        //     resource: event
        // });
        let response=await response_generator(auth,calendarId,event);
        //Checking if the event was successfully created.
        // 200 "OK" implies successful event creation
        console.log(response);
        if (response['status'] == 200 && response['statusText'] === 'OK') {
		return response['status'];
        } else {
		return "not okay";
        }
    } catch (error) {
        console.log(`CreatecalEvent error ${error}`);
        return "failed in catch";
    }
};

async function response_generator(auth, calendarId, event){
    let response = calendar.events.insert({
        auth: auth,
        calendarId: calendarId,
        resource: event
    });
    return response;
}

// createcalEvent(event)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// const startview = prompt('What is your start view date?  2022-03-30T19:46:00.000Z');
// console.log(`Event name is  ${startview}`);

// const endview = prompt('What is the end view date?  2022-03-30T19:46:00.000Z');
// console.log(`Event desc is  ${endview}`);

// startview = '2022-03-22T19:46:00.000Z';
// endview = '2022-04-24T20:46:00.000Z';

//Get all the events between two dates
const getEvents = async (startview, endview) => {

    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: startview,
            timeMax: endview,
            timeZone: 'America/New_York'
        });
        let output_list = [];
        console.log(response["data"]["items"]);
        for (let i = 0; i < response['data']['items'].length; i++)

        {
            // let items_id = response['data']['items'][i].id;
            // console.log(items_id);
            // let items = response['data']['items'][i].summary;
            // console.log(items);
            let items_id = response['data']['items'][i].id;
            items_id = items_id.concat(": ");
            let items = response['data']['items'][i].summary;
            items = items_id.concat(items);
            output_list.push(items);
        }
        return output_list;        
    } catch (error) {
        console.log(`Check getEvents function for ${error}`);
        return "not okay";
        
    }
};

//Harcoded for testing purposes
//let start = '2022-03-22T19:46:00.000Z';
//let end = '2022-03-24T20:46:00.000Z';

// getEvents(startview, endview)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
//     
// const eventId = prompt('What is the ID you wish to delete');
// console.log(`Event ID is  ${eventId}`);

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
//         
//         } else {
//         console.log("Event Deletion Failed");
//         
//         }
//     } catch (error) {
//         console.log(`Delete Event --> ${error}`);
//         
//     }
// };

// deleteEvent(eventId)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

exports.createcalEvent = createcalEvent;
exports.getEvents = getEvents;
