// Instructions to make commands through the Mattermost Server:
// show issues | type repo name that is displayed | issues in that repo is displayed
// close issue | type repo name that is displayed | issues with ID displayed | type ID to remove
// create issue | Enter {repo name} | Enter {Issue Title} | Enter {Issue Body}"
// show todo | if todo list exists, displays else says nothing there 
// add todo | type task | responds with added message
// remove todo | shows todo list and asks you to enter a number to remove | removes task 
// create reminder | Enter {reminder} | Enter date and time in formate specified | Reminder Created i.e cronJob schedule
// show reminders | displays list of reminders
// remove reminder | Enter {reminder number to remove} | Reminder removed
// (Not a Command) | Automatic Issue reminders that have been created

// Importing necessary packages and js files
// Database connectivity
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get, update, remove } from "firebase/database";
import Client from "mattermost-client";
import "./toDoListBot.cjs";
import {listAuthenicatedUserRepos, getIssues, closeIssues, createIssue, getUser} from "./toDoListBot.cjs";
import { readFile } from 'fs/promises';
const firebase_data = JSON.parse(await readFile(new URL('./firebase_data.json', import.meta.url)));
import cron from "cron";
import crypto from "crypto";
import { channel } from 'diagnostics_channel';
import axios from "axios";
import "./calendar.cjs";
import {createcalEvent, getEvents} from "./calendar.cjs";

//import firebase_data from './firebase_data.json';
// const Client = require('mattermost-client');
// const toDoListBot = require('./toDoListBot');

// Credentials needed for Database Connectivity
const firebaseApp = initializeApp({
    apiKey: firebase_data.firebase_metadata.apiKey,
    authDomain: firebase_data.firebase_metadata.authDomain,
    projectId: firebase_data.firebase_metadata.projectId,
    storageBucket: firebase_data.firebase_metadata.storageBucket,
    messagingSenderId: firebase_data.firebase_metadata.messagingSenderId,
    appId: firebase_data.firebase_metadata.appId,
    measurementId: firebase_data.firebase_metadata.measurementId
  });
  
const db = getDatabase();
const dbRef = ref(getDatabase());

let host = "chat.robotcodelab.com"
let group = "CSC510-S22"
let bot_name = "@focus-bot"
let client = new Client(host, group, {});

// Global list to store the list of repo names to be used to call the listIssues function.
let repo_names = []
// To access the issue number with repo name and issue ID entered
let req_repo_name = ""
// To store the list of issues from github api, from specific repo entered by the user, and loop through it to find a match with the issues ID. Used in one of the hears for closing an issue
let global_issues = []
let issue_id = 0;
//Initially used this global dictionary to store todo list before database connectivity was established
//var todoList = []
// All global values to store the details from api calls to be given to other functions. These values are overwritten for every time the commands are called. Temporary but global values since it is need by multiple functions
let repo_name_for_create_issue = ""
let issue_title = ""
let issue_body = ""
// To keep track the chain of commands
let command_list = []
// To store the user name that is fetched from github (from user and login) and using the same to check if user exists in db else creates a profile in DB. 
let userID = "";
// Global dictionary to save the reminder-Associated cronJob (key-value pair)
let reminder_job_dict = {};
let issue_reminder_job_dict = {};
let event = ""
let desc = ""
let start = ""
let end = ""
let start_event = "";
let end_event = "";
let start_date = "";
let start_time = "";
let end_date="";
let end_time = ""
let start_delimiter = "";
let end_delimiter = "";
let view_start_date=""
let view_start_time=""
let view_end_date=""
let view_end_time=""
let view_start_delimiter = "";   
let view_end_delimiter = "";
let view_day = "";
let view_month= "";
let view_year = "";



async function main()
{   

    // To check if the current user exists in the database or not
    checkUserInDB();
    // Idea: cronJob to make an api call every few to get issues, compare with the ones in the database, and create cronJob if it doesn't exist. Getting issues
    // from every repo and making a check if it exists in db. Yet to think of a logic to handle a deleted issue before reminder kicks in. Might have to stop the job.
    issueReminders();
    // To send a welcome message the moment the code is run, using axios to post a message to a given ID
    // However, here we are using the channel ID and not getting it dynamically for which we will have to come up with a solution
    var options = {
		url: "https://chat.robotcodelab.com/api/v4/posts",
		method: 'POST',
		headers: {
			"content-type": "application/json",
			"Authorization": `token ${process.env.FOCUSBOTTOKEN}`,
			"accept": "application/json, text/plain, */*"
		},
    data: {"channel_id": "wkibg1y1qjy1pnpego1pxi8cua", "message": "Hi there! I am PAM- your Personal Accountability Manager",  "props":{"attachments": [{"pretext": "Hocus Pocus- Let's Focus!", "text": "Type \"help\" to see how I can assist you to be productive"}]}}
	};

    axios(options) 
    .then(function(response) {
    //console.log(response.data);
    })
    .catch(function (error) {
    //console.log((error));
    }); 

    let request = await client.tokenLogin(process.env.FOCUSBOTTOKEN);
    client.on('message', function(msg)
    {
        //console.log(msg);
	 if(hears(msg, "Hi") || hears(msg, "hi") || hears(msg, "Hello"))
        {   
            greetingsReply(msg);
        }
	else if(hears(msg,"stop"))
        {
        command_list.splice(0, command_list.length);
        let channel = msg.broadcast.channel_id;
        client.postMessage(`Process has stopped. Enter 'help' for available commands !!  \u270A`, channel);


	}		   
        else if(hears(msg, "show issues"))
        {
            listRepos(msg);
            command_list.push("show issues");         
        }
        else if(command_list[0] == "show issues" && hearsForRepoName(msg, "dummy"))
        {   
            // Flag to check if command chain is "show issues" or "close issues" and if "close issues" then appropriate message will be displayed and flag only for that reason
            let close_issue_flag = 0;
            listIssues(msg, close_issue_flag)
            command_list.pop();           
        }
        else if(hears(msg, "close issue"))
        {
            listRepos(msg);
            command_list.push("close issue");
        }
        else if(command_list[0] == "close issue" && hearsForRepoName(msg, "dummy"))
        {   
            let close_issue_flag = 1;
            listIssues(msg, close_issue_flag)
            command_list.push("repo name entered for closing issue")           
        }
        else if(command_list[0] == "close issue" && command_list[1] == "repo name entered for closing issue" && hearsForIssueID(msg))
        {   
            closeIssueID(msg, req_repo_name, issue_id);
            command_list.splice(0, command_list.length);
        }
        else if(hears(msg, "show todo"))
        {
            showTodo(msg);
        }
        else if(hears(msg, "add todo"))
        {
            displayAddTodoMessage(msg);
            command_list.push("add todo");
        }
        else if(command_list[0] == "add todo" && hearsForNonEmptyString(msg))
        {   
            addTodo(msg);
            command_list.pop();    
        }
        else if(hears(msg, "remove todo"))
        {   
            command_list.push("remove todo");
            let channel = msg.broadcast.channel_id;
            let temp_todo_list = []
            get(child(dbRef, `users/` + userID)).then((snapshot) => {
                if (snapshot.exists()) 
                {
                    temp_todo_list = snapshot.val().todo_list;
                }
                if (temp_todo_list.length < 2) 
                { 
                    client.postMessage('You have no tasks to remove \u2705', channel);
                    command_list.pop();
                }
                else
                {
                    for(var i= 1; i < temp_todo_list.length; i++)
                    {
                        client.postMessage(temp_todo_list[i], channel);
                    }
                    setTimeout(function(){
                        client.postMessage("\u261B Enter the task number that you want to remove", channel);
                    }, 1000);
                    
                } 
                }).catch((error) => {
                console.error(error);
            });
        }
        else if(command_list[0] == "remove todo" && hearsForNumber(msg))
        {   
            removeTodo(msg);    
            command_list.pop();
        }
        else if(hears(msg, "create issue"))
        {
            displayCreateIssue(msg);
            command_list.push("create issue");
        }
        else if(command_list[0] == "create issue" && command_list[1] != "Repo name entered" && hearsForRepoName(msg))
        {   
            displayNextMsgForCreateIssue(msg);
            command_list.push("Repo name entered")
        }
        else if(command_list[0] == "create issue" && command_list[1] == "Repo name entered" && command_list[2] != "Issue title entered" && hearsForNonEmptyString(msg))
        {
            displayThirdMsgForCreateIssue(msg);
            command_list.push("Issue title entered");
        }
        else if(command_list[0] == "create issue" && command_list[1] == "Repo name entered" && command_list[2] == "Issue title entered" && hearsForNonEmptyString(msg))
        {
            createIssueBody(msg, issue_title, repo_name_for_create_issue);
            command_list.splice(0, command_list.length);
        }
        else if(hears(msg, "help"))
        {
            displayHelpWithCommands(msg);
        }
        else if(hears(msg, "create reminder"))
        {
            displayCreateReminderMessage(msg);
            command_list.push("create reminder");
        }
        else if(command_list[0] == "create reminder" && command_list[1] != "reminder entered" && hearsForNonEmptyString(msg))
        {
            displayCreateReminderMessageTwo(msg);
            command_list.push("reminder entered");
        }
        else if(command_list[0] == "create reminder" && command_list[1] == "reminder entered" && hearsForNonEmptyString(msg))
        {
            createReminder(msg);
            command_list.splice(0, command_list.length);
        }
        else if(hears(msg, "show reminders"))
        {
            showReminders(msg);
        }
        else if(hears(msg, "remove reminder"))
        {
            command_list.push("remove reminder");
            let channel = msg.broadcast.channel_id;
            let temp_reminder_list = []
            get(child(dbRef, `users/` + userID)).then((snapshot) => {
                if (snapshot.exists()) 
                {
                    temp_reminder_list = snapshot.val().reminders;
                }
                if (temp_reminder_list.length < 2) 
                { 
                    client.postMessage("You have no reminders \u23F0", channel);
                }
                else
                {
                    for(var i= 1; i < temp_reminder_list.length; i++)
                    {   
                        let rem_array = temp_reminder_list[i].split(" ");
                        rem_array.shift();
                        let rem_to_post = rem_array.join(" ");
                        rem_to_post = i.toString().concat("."," ").concat(rem_to_post);
                        client.postMessage(rem_to_post, channel);
                    }
                    setTimeout(function(){
                        client.postMessage("\u261B Enter the reminder number that you want to remove: ", channel);
                    }, 1300);
                    
                } 
                }).catch((error) => {
                console.error(error);
            });
        }
        else if(command_list[0] == "remove reminder" && hearsForNumber(msg))
        {   
            removeReminders(msg);    
            command_list.pop();
        }
            // View Meeting section begins here

        
        else if(hears(msg, "show meetings"))
        {
            displayViewCalendarMessagestartDate(msg);
            command_list.push("show meetings");
            console.log(command_list)
        }

        else if(command_list[0] == "show meetings" && command_list[1] != "Start Date entered" && hearsForNonEmptyString(msg))
        {   
       

	command_list.push("Start Date entered");
        displayViewCalendarMessagestartTime(msg);
		
       //     displayViewCalendarMessagestartTime(msg);
            //command_list.push("Start Date entered");
        }

        else if(command_list[0] == "show meetings" && command_list[1] == "Start Date entered" && command_list[2] != "Start time entered" && hearsForNonEmptyString(msg))
        {   
	    command_list.push("Start time entered");	
            displayViewCalendarMessageendDate(msg);
//            command_list.push("Start time entered");
        }

        else if(command_list[0] == "show meetings" && command_list[1] == "Start Date entered" && command_list[2] == "Start time entered" && command_list[3] != "End date entered" && hearsForNonEmptyString(msg))
        {   
            command_list.push("End date entered");
            displayViewCalendarMessageendTime(msg);
          //  command_list.push("End date entered");
        }

        else if(command_list[0] == "show meetings" && command_list[1] == "Start Date entered" && command_list[2] == "Start time entered" && command_list[3] == "End date entered"  && hearsForNonEmptyString(msg))
        {   
        command_list.push("End time entered");
	getEventFuncFromCalendarJs(msg);

        //   command_list.push("End time entered");
         }

        else if(command_list[0] == "show meetings" && command_list[1] == "Start Date entered" && command_list[2] == "Start time entered" && command_list[3] == "End date entered" && command_list[4] == "End time entered" && hearsForNonEmptyString(msg))
        {
         //   getEventFuncFromCalendarJs(msg);
            command_list.splice(0, command_list.length);
        }

        // View Meeting section ends here


        else if(hears(msg, "create meeting"))
        {   
        command_list.push("create meeting");
  
	displayCreateCalendarMessage(msg);
//            command_list.push("create calendar");
        }
        //Workflow: Create calendar --> Enter Calendar name --> Enter Calendar Description --> Enter StartDate --> Enter StartTime --> Enter EndDate --> Enter Endtime
        else if(command_list[0] == "create meeting" && command_list[1] != "calendar name entered" && hearsForNonEmptyString(msg))
        {
        command_list.push("calendar name entered");

	displayCreateCalendarMessagestartDate(msg);
//            command_list.push("calendar name entered");
        }
        
        else if(command_list[0] == "create meeting" && command_list[1] == "calendar name entered" && command_list[2] != "start date entered" && hearsForNonEmptyString(msg))
        {
	command_list.push("start date entered");

	displayCreateCalendarMessagestartTime(msg);
       //     command_list.push("start date entered");
        }
        else if(command_list[0]=="create meeting" && command_list[1]=="calendar name entered" && command_list[2] == "start date entered" && command_list[3] != "start time entered" && hearsForNonEmptyString(msg))
        {
        command_list.push("start time entered");
   
	displayCreateCalendarMessageendDate(msg);
          //  command_list.push("start time entered");
        }

        else if(command_list[0]=="create meeting" && command_list[1]=="calendar name entered" && command_list[2] == "start date entered" && command_list[3] == "start time entered" && command_list[4] != "end date entered" && hearsForNonEmptyString(msg))
        {
        command_list.push("end date entered");

	displayCreateCalendarMessageendTime(msg);
//            command_list.push("end date entered");
        }
        
        else if(command_list[0]=="create meeting" && command_list[1]=="calendar name entered" && command_list[2] == "start date entered" && command_list[3] == "start time entered" && command_list[4] == "end date entered" && command_list[5] != "end time entered" && hearsForNonEmptyString(msg))
        {
        command_list.push("end time entered");
	displayCreateCalendarMessagedesc(msg);
//        command_list.push("end time entered");
        }
        
        // else if(command_list[0] == "create calendar" && command_list[1] == "calendar name entered" && command_list[2] == "start date entered" && command_list[3] != "end date entered" && hearsForNonEmptyString(msg))
        // {
        //     displayCreateCalendarMessagedesc(msg);
        //     command_list.push("end date entered");
        // }
        else if(command_list[0]=="create meeting" && command_list[1]=="calendar name entered" && command_list[2] == "start date entered" && command_list[3] == "start time entered" && command_list[4] == "end date entered" && command_list[5] == "end time entered" && hearsForNonEmptyString(msg))
        {   
            createCalendarPayload(msg);
            command_list.splice(0, command_list.length);        
        }
        
        else
        {   
            let channel = msg.broadcast.channel_id;
            if( msg.data.sender_name != bot_name && (command_list[0] == "show issues" || command_list[0] == "close issue" || command_list[0] == "create issue") && command_list[1] != "repo name entered for closing issue" )
            {   
                // Error handling for repo name not matching with the list of repo names for that user
                client.postMessage("Repo name entered does not match with the ones given above, kindly start over", channel);
                command_list.splice(0, command_list.length);
            }
            else if( msg.data.sender_name != bot_name && (command_list[0] == "remove todo" || command_list[0] == "remove reminder") && !hearsForNumber(msg))
            {   
                // Error handling for task number to remove not being valid
                client.postMessage("Please enter a valid number, kindly start over", channel);
                command_list.splice(0, command_list.length);
            }
            else if( msg.data.sender_name != bot_name && command_list[0] == "close issue" && command_list[1] == "repo name entered for closing issue" )
            {   
                // Error handling for task number to remove not being valid
                client.postMessage("Please enter a valid Issue ID from the ones given above , kindly start over", channel);
                command_list.splice(0, command_list.length);
            }
            else if( msg.data.sender_name != bot_name)
            {
                client.postMessage("I can only understand a few commands! After all I am a bot! Please type help for a list of valid commands", channel);
            }
            
        }

    });
}

// DB check is made to see if user exists else add the user
async function checkUserInDB()
{
    // Getting userID using github api to get users that is common in github and mattermost as a pre-condition and checking to see if that userID exists in the database
    userID = await getUser().catch( 
        err => console.log("Unable to get UserID, check internet, or try again after awhile. Server down") );
    
    //read from Firebase to check if user exists or not
    get(child(dbRef, `users/` + userID)).then((snapshot) => {
    if (!snapshot.exists()) 
    {
      //console.log(snapshot.val());
      //write to Firebase
      set(ref(db, 'users/' + userID), {
          todo_list: ["temp"],
          reminders: ["temp"],
          issues: ["temp"]
        });
    }
    }).catch((error) => {
    console.error(error);
    });
}

// Hears function to match the exact commands and given commands
function hears(msg, text)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {
        let post = JSON.parse(msg.data.post);
        if( post.message === text)
        {
            return true;
        }
    }
    return false;
}

// Hear function that will listen to a message in a chain of commands. The chain of commands the user enters is already being stored and being checked and hence checking 
// if what the user enters under a particular chain of commands is non empty legitimate string
function hearsForNonEmptyString(msg)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {
        let post = JSON.parse(msg.data.post);
        if( post.message != "")
        {
            return true;
        }
    }
    return false;
}

// Hears function just to listen to hte repo names
function hearsForRepoName(msg, text)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {   
        let channel = msg.broadcast.channel_id;
        let post = JSON.parse(msg.data.post);
        // To store the list of repo_names as a string that is used to check if the user input repo_name is a valid one
        let repos = Object.values(repo_names);
        for(var i = 0 ; i < repos.length; i++)
        {   
            text = repos[i]
            if( post.message == text)
            {   
                return true;
            }
        }
    }
    return false;
}

// Hears function just to listen to the issue ID. Cannot be combined with any other hears function as some preprocessing i.e issue entered is being checked with the list of 
// issues for the repo name entered. Hence separate function required.
function hearsForIssueID(msg)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {   
        let post = JSON.parse(msg.data.post);

        for(var i = 0 ; i < global_issues.length; i++)
        {
            let arr = global_issues[i].split(' ');
            let temp_issue_id = arr[arr.length - 1]
            if( post.message === temp_issue_id)
            {   
                issue_id = parseInt(temp_issue_id);
                return true;
            }
        } 
        
    }
    return false;
}

// Hears function for any sort of number. remove todo and remove reminder would use this 
function hearsForNumber(msg)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {
        let post = JSON.parse(msg.data.post);
        //let pattern = /\d/g;
        if(!isNaN(post.message))
        {
            return true;
        }
    }
    return false;
}

function greetingsReply(msg)
{
    let channel = msg.broadcast.channel_id;
    client.postMessage(`Good to see you here! Hocus Pocus- Let's help you Focus \u270A`, channel);   
}

function displayHelpWithCommands(msg)
{
    let channel = msg.broadcast.channel_id;
    client.postMessage("Here are the commands that you can use, followed by their usage instructions:", channel);

    setTimeout(function()
    {
        client.postMessage("\u2192 show issues" + "\n \t \u2022  Enter {repo name}" + "\t \u2022  Issues with ID displayed", channel);
        client.postMessage("\u2192 close issue" + "\n \t \u2022  Enter {repo name}" + "\t \u2022  Issues with ID displayed" + "\t \u2022  Enter ID of issue to remove", channel);
        client.postMessage("\u2192 create issue" + "\n \t \u2022  Enter {repo name}" + "\t \u2022  Enter {Issue Title}" + "\t \u2022  Enter {Issue Body}", channel);
        client.postMessage("\u2192 show todo" + "\n \t \u2022   If todo list exists, displays else says nothing there", channel);
        client.postMessage("\u2192 add todo" + "\n \t \u2022  Enter {task}", channel);
        client.postMessage("\u2192 remove todo" + "\n \t \u2022   Enter {number of task shown}" + "\t \u2022   removes task", channel); 
        client.postMessage("\u2192 create reminder" + "\n \t \u2022 Enter {reminder}" + "\t \u2022  Enter date and time in format specified", channel);
        client.postMessage("\u2192 show reminders" + "\n \t \u2022  displays list of reminders", channel);
        client.postMessage("\u2192 remove reminder" + "\n \t \u2022  Enter {reminder number to remove}", channel);
    }, 1000);

    
}

async function listRepos(msg)
{   
    //let owner = msg.data.sender_name.replace('@', '');
    let channel = msg.broadcast.channel_id;
    client.postMessage(`\u261B Enter the repo name for which you want to execute the command:`, channel);
    repo_names = await listAuthenicatedUserRepos().catch( (err) => {
        client.postMessage("Unable to complete request, sorry! Github server down!", channel);
        command_list.splice(0, command_list.length); 
    });

    client.postMessage(JSON.stringify(repo_names, null, 4), channel);
}

async function listIssues(msg, close_issue_flag)
{   
    let flag = 0;
    let owner = msg.data.sender_name.replace('@', '');
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    req_repo_name = post.message;
    // let issue = await getIssues(owner, req_repo_name).catch( 
    //     err => client.postMessage(`Unable to access ${req_repo_name}`, channel) );
    
    // command_list must be popped otherwise when user performs a new command, error hanling for close issue takes places
    // This way, if an api call fails or if there is some sort of error, the command list is made empty and user has to start closing the issue again
    let issue = await getIssues(owner, req_repo_name).catch( (err) => {
        client.postMessage(`Unable to access ${req_repo_name}`, channel);
        command_list.splice(0, command_list.length);
    });    
    global_issues = issue;
    if(issue && issue.length != 0)
    {   
        for(var i = 0; i < issue.length; i++)
        {
            let issue_array = issue[i].split("ID: ");
            let issue_id = issue_array[1];
            client.postMessage(`Title: ${issue_array[0]}
            \u21E7 ID: ${issue_id}`, channel);
        }
        setTimeout(function(){
            if(close_issue_flag == 1){client.postMessage("\u261B Enter the Issue ID of the issue that you want to close", channel);}
        }, 1300);
        
    }
    else if(issue && issue.length == 0)
    {   // Accessible repo but no issues in the repo so "issue" list will be empty
        client.postMessage(`No issues in ${req_repo_name}`, channel);
    }   
}

// Fucntion to close the issue specified by the issue number that the user enters in the chat
async function closeIssueID(msg, req_repo_name, issue_id)
{   
    let owner = msg.data.sender_name.replace('@', '');
    let channel = msg.broadcast.channel_id;
    // let post = JSON.parse(msg.data.post).message;
    // const temp_array = post.split(" ");
    // let issue_id_to_close = parseInt(temp_array[1]);
    var closeStatus = await closeIssues(owner, req_repo_name, issue_id).catch( (err) => {
        client.postMessage(`Issue cannot be closed, start close issue chain again`, channel);
        command_list.splice(0, command_list.length);
    });
        if( closeStatus )
        {  
            client.postMessage(`Issue has been successfully closed!`, channel);
        }
}

// This show todo function uses the database to fetch the list for the user who is running the code. Previously had written the same functionality with todoList- a global list
async function showTodo(msg)
{
    let channel = msg.broadcast.channel_id;
    let temp_todo_list = []
    await get(child(dbRef, `users/` + userID)).then((snapshot) => {
        if (snapshot.exists()) 
        {
          temp_todo_list = snapshot.val().todo_list;
        }
        if (temp_todo_list.length < 2) 
        { 
            client.postMessage("There is nothing to show \u2705", channel);
        } 
        }).catch((error) => {
        console.error(error);
        });
    
    for(var i= 1; i < temp_todo_list.length; i++)
    {
        client.postMessage(temp_todo_list[i], channel);
    }
    
}

async function displayAddTodoMessage(msg)
{
    let channel = msg.broadcast.channel_id;
    client.postMessage("\u261B Enter the task to be added: ", channel);
}

async function addTodo(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    var message_to_push = post.message;

    // Getting the todo_list in the database for this user as a list and appending to this list and replacing the old list with the new list in the database
    let temp_todo_list = []
    await get(child(dbRef, `users/` + userID)).then((snapshot) => {
        if (snapshot.exists()) 
        {
          temp_todo_list = snapshot.val().todo_list;
          var todo_id = temp_todo_list.length;
          message_to_push = todo_id.toString().concat("."," ").concat(message_to_push);
          temp_todo_list.push(message_to_push);
        } 
        }).catch((error) => {
        console.error(error);
        });

    //update data
    const user_todo_data = temp_todo_list;
    const updates = {};
    updates[`/users/` + userID + `/todo_list/`] = user_todo_data;
    update(ref(db), updates);
    
    // This was using a global list called todoList
    //todoList.push(message_to_push);
    client.postMessage("Task added!", channel);
}

async function removeTodo(msg)
{   
    let channel = msg.broadcast.channel_id;
    let temp_todo_list = []
    let removed = []
    let post = JSON.parse(msg.data.post);
    var task_id_to_remove = parseInt(post.message);
    await get(child(dbRef, `users/` + userID)).then((snapshot) => {
        if (snapshot.exists()) 
        {
            temp_todo_list = snapshot.val().todo_list;
            removed = temp_todo_list.splice(task_id_to_remove, 1);
        } 
        }).catch((error) => {
        console.error(error);
    });

    if(removed.length == 0)
    {
        client.postMessage("Please enter a number from the list shown above, try again from the beginning", channel);
        command_list.splice(0, command_list.length);
    }
    else
    {
        // To update the serial number of the tasks
        for(var i = 1; i < temp_todo_list.length; i++)
        {
            temp_todo_list[i] = temp_todo_list[i].replace(temp_todo_list[i].charAt(0), "");
            temp_todo_list[i] = i.toString().concat(temp_todo_list[i]);
        }

        //update data
        const user_todo_data = temp_todo_list;
        const updates = {};
        updates[`/users/` + userID + `/todo_list/`] = user_todo_data;
        update(ref(db), updates);    
        client.postMessage("Task " + post.message + " successfully removed!", channel);
    }
}

async function displayCreateIssue(msg)
{
    let channel = msg.broadcast.channel_id;
    client.postMessage("\u261B Enter a repo to create an issue from the list below: ", channel);
    await listRepos(msg);
}

async function displayNextMsgForCreateIssue(msg)
{   
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    repo_name_for_create_issue =  post.message;
    client.postMessage("\u261B Enter the Title of the issue", channel);
}

async function displayThirdMsgForCreateIssue(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    issue_title =  post.message;
    client.postMessage("\u261B Enter the body of the issue", channel);
}

async function createIssueBody(msg, issue_title, repo_name_for_create_issue)
{   
    let owner = msg.data.sender_name.replace('@', '');
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    issue_body = post.message;
    let status_of_api = await createIssue(owner, repo_name_for_create_issue, issue_title, issue_body).catch( (err) => {
        client.postMessage("Unable to complete request, sorry!", channel);
        command_list.splice(0,command_list.length); 
    });
    if(status_of_api)
    {
        client.postMessage("Issue has been created!", channel);
    }
}

async function displayCreateReminderMessage(msg)
{
    let channel = msg.broadcast.channel_id;
    client.postMessage("\u261B Enter reminder: ", channel);
}


async function displayCreateReminderMessageTwo(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    var reminder_to_push = post.message;

    // Getting the reminder_list in the database for this user as a list and appending to this list and replacing the old list with the new list in the database
    let temp_reminder_list = []
    await get(child(dbRef, `users/` + userID)).then((snapshot) => {
        if (snapshot.exists()) 
        {
          temp_reminder_list = snapshot.val().reminders;
          // Generating random ID for the reminder to store its job uniquely
          const id = crypto.randomBytes(16).toString("hex"); 
          reminder_to_push = id.concat(" ").concat(reminder_to_push);
          temp_reminder_list.push(reminder_to_push);
        } 
        }).catch((error) => {
        console.error(error);
        });

    //update data
    const user_rem_data = temp_reminder_list;
    const updates = {};
    updates[`/users/` + userID + `/reminders/`] = user_rem_data;
    update(ref(db), updates);

    client.postMessage("\u261B When shall I remind you? Enter date and time- 24 hour format (FORMAT: YYYY-MM-DD hh:mm ): ", channel);
}

async function createReminder(msg)
{   
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    let reminder = "";
    let reminder_with_id = "";

    // Converting String to array so that the first element can then be split according to "-" and second one according to ':'
    let cronJob_details_array = post.message.split(" ");
    
    let cronJob_date_array = cronJob_details_array[0].split('-');
    let cronJob_time_array = cronJob_details_array[1].split(':');
    
    // Generate a cronJob for these details here from user input
    let cron_day = cronJob_date_array[2];
    let cron_month= cronJob_date_array[1];
    let cron_year = cronJob_date_array[0];
    let cron_hours =  cronJob_time_array[0];
    let cron_minutes =  cronJob_time_array[1];

    // Input being set appropriately since cronJob takes a date as an input and giving a date makes it run once and breaks. Giving an expression makes it run repeatedly
    let date = new Date();
    let cron_month_minus_one = parseInt(cron_month) - 1;
    date.setDate(parseInt(`${cron_day}`));
    date.setMonth(`${cron_month_minus_one}`);
    date.setFullYear(cron_year);
    date.setHours(parseInt(`${cron_hours}`));
    date.setMinutes(parseInt(`${cron_minutes}`));
    date.setSeconds(0);

    // To get the current date and compare it with the date entered. Proceeds only if the entered date is equal or greater than the current date
    var q = new Date();
    var m = q.getMonth();
    var d = q.getDate();
    var y = q.getFullYear();
    var h = q.getHours();
    var min = q.getMinutes();
    var current_date = new Date(y,m,d, h, min);

    // Error handling for create reminder command. If user makes an error, making the command_list array empty so that the user starts over again
    if(date < current_date || (parseInt(`${cron_day}`) < 1 && parseInt(`${cron_day}`) > 31 ) || (parseInt(`${cron_month_minus_one}`) < 0 && parseInt(`${cron_month_minus_one}`) > 11 ))
    {
        client.postMessage("Please enter a valid date and time following the format! Try again from the beginning", channel);
        command_list.splice(0, command_list.length);

        // Removing the reminder that was inserted as the user has to start over as part of error handling if they entered invalid time and date
        let temp_reminder_list = []
        await get(child(dbRef, `users/` + userID)).then((snapshot) => {
            if (snapshot.exists()) 
            {
                // Removing the last element from the list of reminders
                temp_reminder_list = snapshot.val().reminders;
                var removed = temp_reminder_list.splice(temp_reminder_list.length - 1, 1);
            } 
            }).catch((error) => {
            console.error(error);
        });
    
        //update data
        const user_reminder_data = temp_reminder_list;
        const updates = {};
        updates[`/users/` + userID + `/reminders/`] = user_reminder_data;
        update(ref(db), updates);
    }
    else
    {
        // Getting the reminder message to send it to the cronJob
        let temp_reminder_list = []
        await get(child(dbRef, `users/` + userID)).then((snapshot) => {
            if (snapshot.exists()) 
            {  
            // Getting the reminder from the Database, removing the ID from it, and passing it to the cronJob here so that the cronJob will know which reminder to print
            // Creates a snapshot of what reminder it must post to the channel when it is being scheduled
            temp_reminder_list = snapshot.val().reminders;
            reminder = temp_reminder_list[temp_reminder_list.length - 1];
            let reminder_array = reminder.split(" ");
            reminder_array.shift();
            reminder = reminder_array.join(" ");

            // After processing the reminder for the cronJob, set the time details entered by the user to the reminder to be displayed when show reminders is called
            temp_reminder_list[temp_reminder_list.length - 1] = temp_reminder_list[temp_reminder_list.length - 1].concat(" ").concat(post.message);
            reminder_with_id = temp_reminder_list[temp_reminder_list.length - 1];

            } 
            }).catch((error) => {
            console.error(error);
            });

        // Adding the time details and updating the database with the details appended to the end of the string
        // In DB: "{Unique ID} {reminder message} {time details}"
        const user_rem_data = temp_reminder_list;
        const updates = {};
        updates[`/users/` + userID + `/reminders/`] = user_rem_data;
        update(ref(db), updates);

        // createCronJobs(cron_day, cron_month, cron_year, cron_hours, cron_minutes, reminder, reminder_with_id, channel);
        createCronJobs(date, reminder, reminder_with_id, channel);
        client.postMessage("Reminder Created!", channel);
    }   
}

// CronJob is getting created and the respective reminder is being posted in the channel
// function createCronJobs(cron_day, cron_month, cron_year, cron_hours, cron_minutes, reminder, reminder_with_id, channel)
function createCronJobs(date, reminder, reminder_with_id, channel)
{   
    // Creating the cronJob with the date and time read from the user
    const job = new cron.CronJob(date, async function() {
        // Once the cronjob for a particular job kicks in, the reminder is removed and DB is updated in the code below
        client.postMessage(`REMINDER ALERT: 
        \u23F1 ${reminder}`, channel);
        let temp_reminder_list = []
        await get(child(dbRef, `users/` + userID)).then((snapshot) => {
            if (snapshot.exists()) 
            {
                temp_reminder_list = snapshot.val().reminders;
                for(var i= 1; i < temp_reminder_list.length; i++)
                {
                    if(temp_reminder_list[i] == reminder_with_id)
                    {
                        temp_reminder_list.splice(i, 1);
                    }
                }
            } 
            }).catch((error) => {
            console.error(error);
            });

        //update data
        const user_rem_data = temp_reminder_list;
        const updates = {};
        updates[`/users/` + userID + `/reminders/`] = user_rem_data;
        update(ref(db), updates);
        });
    reminder_job_dict[reminder_with_id] = job;
    job.start();
    
}

// Getting the list of reminders from the database, numbering them, displaying them on mattermost channel
async function showReminders(msg)
{
    let channel = msg.broadcast.channel_id;
    let temp_reminder_list = []
    await get(child(dbRef, `users/` + userID)).then((snapshot) => {
        if (snapshot.exists()) 
        {
            temp_reminder_list = snapshot.val().reminders;
        }
        if (temp_reminder_list.length < 2) 
        { 
            client.postMessage("You have no reminders \u23F0", channel);
        } 
        }).catch((error) => {
        console.error(error);
        });
    for(var i= 1; i < temp_reminder_list.length; i++)
    {   
        let rem_array = temp_reminder_list[i].split(" ");
        rem_array.shift();
        let time_details = rem_array.at(-2).concat(" ").concat(rem_array.at(-1));
        rem_array.splice(-2,2);
        let rem_to_post = rem_array.join(" ");
        rem_to_post = i.toString().concat("."," ").concat(rem_to_post);
        client.postMessage(`${rem_to_post}
        \u2022 ${time_details}`, channel);
    }
    
}

async function removeReminders(msg)
{
    let channel = msg.broadcast.channel_id;
    let temp_reminder_list = []
    let post = JSON.parse(msg.data.post);
    var rem_id_to_remove = parseInt(post.message);
    await get(child(dbRef, `users/` + userID)).then((snapshot) => {
        if (snapshot.exists()) 
        {
            // Removing reminder from the database but haven't stopped cronJob yet
            temp_reminder_list = snapshot.val().reminders;
            var removed = temp_reminder_list.splice(rem_id_to_remove, 1);

            // Stopping the cronJob scheduled using cronJob.stop() method by accessing the job with the unique reminder id which is the variable "removed"
            Object.keys(reminder_job_dict).forEach((key) => {
                if(key == removed){reminder_job_dict[key].stop()}
              });
            
            // Removing the reminder and the job (key value pair) from the global dictionary 
            delete reminder_job_dict[removed];
        } 
        }).catch((error) => {
        console.error(error);
    });

    //update data
    const user_reminder_data = temp_reminder_list;
    const updates = {};
    updates[`/users/` + userID + `/reminders/`] = user_reminder_data;
    update(ref(db), updates);    
    client.postMessage("Reminder " + post.message + " successfully removed", channel);

}

// issueReminder function begins here
async function issueReminders()
{   
    // Idea: cronJob to make an api call every minute (for now) to get issues, compare with the ones in the database, and create cronJob if it doesn't exist. Getting issues
    // from every repo and making a check if it exists in db. Yet to think of a logic to handle a deleted issue before reminder kicks in. Might have to stop the job.
    
    // Step 1: create a cron job that will fetch all repos every 5 seconds
    // Cron expression that runs every minute
    const job = new cron.CronJob("*/5 * * * * *", async function() {
        let repository_names_list = await listAuthenicatedUserRepos().catch( (err) => {
            console.error("Unable to complete request, sorry! Github server down!");
        });
    // Step 2: Still within the cronJob. Using the list of repos, get issues for every repo
        if(repository_names_list)
        {
        let all_issues_list = [];
        for(var i = 0; i < repository_names_list.length; i++)
        {   
            let issue_list_for_each_repo = [];
            issue_list_for_each_repo = await getIssues(userID, repository_names_list[i]).catch( (err) => {
                console.error(`Unable to access ${repository_names_list[i]}`);
                // if the list is empty also concat of two arrays takes place but if the api gives an error then we need to make the list empty so that concat works and 
                // results don't change
            });
            // To save all issues for each repo in one list itself every time we get a list of issues. Even if api returns error or empty this must work
            if(issue_list_for_each_repo)
            {
                all_issues_list = all_issues_list.concat(issue_list_for_each_repo);
                // console.log(repository_names_list[i], all_issues_list.length);
            }
        }
    // Step 3: After getting all the issues, need to check with the database if the issue exists
        // Get list of issues from db
        let db_issues = [];
        await get(child(dbRef, `users/` + userID)).then((snapshot) => {
            if (snapshot.exists()) 
            {
              db_issues = snapshot.val().issues;
            }
            // Step 4: To check if an issue has been closed in GitHub before the bot reminds you on the channel, i = 1 because index 0 is always going to be "temp" which was needed to create the list in db
            // This is done first before creating cronJob to avoid read and write to db twice in the same function
            // "removed_issue_id_list" will store a list of indices of the issues in db but not in GitHub i.e those that are closed
            let removed_issue_id_list = [];
            for(var i = 1; i < db_issues.length; i++ )
            {   
                let issue_check_index = all_issues_list.indexOf(db_issues[i]); 
                if( issue_check_index == -1)
                {   removed_issue_id_list.push(i);
                    // Then the issue has been closed whether or not the reminder has taken place so we need to check to see if reminder has taken place or not
                    Object.keys(issue_reminder_job_dict).forEach((key) => {
                        if(key == db_issues[i])
                        {
                            issue_reminder_job_dict[key].stop();
                            // Removing job from the dict
                            delete issue_reminder_job_dict[db_issues[i]];
                        }

                    });
                }   
            }
            // This removes all the closed issues from the list that is going to be updated to the database
            for(var i=0; i < removed_issue_id_list.length; i++)
            {
                db_issues.splice(removed_issue_id_list[i], 1);
            }

            // To check if each issue does not exist in the db, running a for loop through all_issues_list and checking with db_issues, if it does not exist it creates a cronJob
            for(var i = 0; i < all_issues_list.length; i++)
            {   
                // returns -1 if element does not exist
                if(db_issues.indexOf(all_issues_list[i]) == -1)
                {   
        // Step 5: If the issues does not exist in the database, create a cronJob and set a reminder for after 1 minutes to test then update the database
                    let issue_reminder_date = new Date();
                    let issue_to_be_posted = all_issues_list[i];
                    issue_reminder_date.setMinutes(issue_reminder_date.getMinutes() + 1);
                    const issue_reminder_job = new cron.CronJob(issue_reminder_date, function() {
                        // Hardcoding the channel ID, with better permissions for the bot from the admin side we will be able to use api calls to retieve the ID
                        client.postMessage(`ISSUE REMINDER ALERT: 
                        \u23F1 ${issue_to_be_posted}`, "wkibg1y1qjy1pnpego1pxi8cua");
                    });
                    issue_reminder_job_dict[issue_to_be_posted] = issue_reminder_job;
                    issue_reminder_job.start();
                    // Update the database with the new issue 
                    db_issues.push(all_issues_list[i]);
                }
            }
            const user_issues_data = db_issues;
            const updates = {};
            updates[`/users/` + userID + `/issues/`] = user_issues_data;
            update(ref(db), updates);
             
            }).catch((error) => {
            console.error(error);
            });
        }
    });
    job.start();
}

// Calendar and meeting part 
async function displayViewCalendarMessagestartDate(msg)
{
    let channel = msg.broadcast.channel_id;
    // let post = JSON.parse(msg.data.post);
    // start_date =  post.message;
    client.postMessage("\u261B Enter Start date of event: Use the format YYYY-MM-DD", channel);
}

async function displayViewCalendarMessagestartTime(msg)
{

    let view_start_date_test = "";
    let view_start_date_test2="";
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    view_start_date =  post.message;
    view_start_date_test2=view_start_date;
    console.log(view_start_date_test2)
    // Error handling

    

    // Converting String to array so that the first element can then be split according to "-" and second one according to ':'
    // let view_start_date = post.message.split(" ");
    
    view_start_date_test = view_start_date_test2.split('-');
    // let cronJob_time_array = cronJob_details_array[1].split(':');
    
    // Generate a date for these details here from user input
    view_day = view_start_date_test[2];
    view_month= view_start_date_test[1];
    view_year = view_start_date_test[0];
    console.log(view_day)
    console.log(view_month)
    console.log(view_year)
    let start_day_length=view_day.length; 
    let start_month_length=view_month.length;
    let start_year_length=view_year.length;
    console.log(command_list);
    
    // Input being set appropriately since this takes a date as an input and giving a date makes it run once and breaks. Giving an expression makes it run repeatedly
    // let date = new Date();
    // date.setDate(parseInt(`${view_day}`));
    // date.setMonth(`${view_month}`);
    // date.setFullYear(view_year);


    // // To get the current date and compare it with the date entered. Proceeds only if the entered date is equal or greater than the current date
    // var q = new Date();
    // var m = q.getMonth();
    // var d = q.getDate();
    // var y = q.getFullYear();

    // var current_date = new Date(y,m,d);

    // Error handling for create reminder command. If user makes an error, making the command_list array empty so that the user starts over again
    if(parseInt(`${view_day}`) < 1 || parseInt(`${view_day}`) > 31  || parseInt(`${view_month}`) < 0 || parseInt(`${view_month}`) > 12  )
    { 
        client.postMessage("Please enter a valid date time following the format! Try again! or enter stop to terminate the process", channel);
        command_list.pop();

	    //        command_list.splice(0, command_list.length);
        // command_list.push("show meetings")
        // displayViewCalendarMessagestartTime(msg);

    }
        else if((start_day_length!==2))
    {
        client.postMessage("Please check day format. Enter Day as DD, Try again or enter stop to terminate the process!",channel)
       // command_list.splice(0, command_list.length);	
	command_list.pop();
	console.log(command_list);
	console.log("Error Case 4 is passing in. Checking Day format");
    }

    else if((start_month_length!==2))
    {
        client.postMessage("Please check month format. Enter Month as MM, Try again or enter stop to terminate the process!",channel)
       // command_list.splice(0, command_list.length);
        command_list.pop();
	console.log("Error Case 5 is passing in. Checking Month format");
    }
        else if((start_year_length!==4))
    {
        client.postMessage("Please check year format. Enter Month as YYYY, Try again or enter stop to terminate the process!",channel)
        command_list.pop();

        //command_list.splice(0, command_list.length);
        console.log("Error Case 6 is passing in. Checking Year format");
    }


    else
    {
    client.postMessage("\u261B Enter Start time of event: HH:MM", channel);
    }    
}

async function displayViewCalendarMessageendDate(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    view_start_time =  post.message;

    // Error handling

    

    // Converting String to array so that the first element can then be split according to "-" and second one according to ':'
    // let view_start_date = post.message.split(" ");
    let view_start_time_test2 = view_start_time
    console.log(view_start_time_test2)
    let view_start_time_test = view_start_time_test2.split(':');
    
    // Generate a date for these details here from user input
    let view_minutes = view_start_time_test[1];
    let view_hour= view_start_time_test[0];
    console.log(view_minutes)
    console.log(view_hour)
    let view_hour_length=view_hour.length;
    let view_minutes_length = view_minutes.length;
    
    if(parseInt(`${view_hour}`) < 1 || parseInt(`${view_hour}`) > 23  || parseInt(`${view_minutes}`) < 0 || parseInt(`${view_minutes}`) > 59 )
    { 
        client.postMessage("Please enter a valid time following the format! Try again or enter stop to terminate the process", channel);
        command_list.pop();

	//        command_list.splice(0, command_list.length);

    }
    else if((view_hour_length!==2))
    {
        client.postMessage("Please check 'hours' format. Enter hours as 'HH', Try again or enter stop to terminate the process!",channel)
//        command_list.splice(0, command_list.length);
          command_list.pop();

	    console.log("Error Case 2 is passing in. Checking Hour format");
    }
        else if((view_minutes_length!==2))
    {
        client.postMessage("Please check 'minutes' format. Enter minutes as 'MM', Try again or enter stop to terminate the process!",channel)
        command_list.pop();

	    //        command_list.splice(0, command_list.length);
        console.log("Error Case 3 is passing in. Checking minutes format");
    }
    
    else
   {
    client.postMessage("\u261B Enter End date of event: Use the format YYYY-MM-DD", channel);
    }
}
async function displayViewCalendarMessageendTime(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    view_end_date =  post.message;

    let view_end_date_test2=view_end_date
    let view_end_date_test = view_end_date_test2.split('-');
    // let cronJob_time_array = cronJob_details_array[1].split(':');
    
    // Generate a date for these details here from user input
    let view_end_day = view_end_date_test[2];
    let view_end_month= view_end_date_test[1];
    let view_end_year = view_end_date_test[0];
    console.log(view_end_day)
    console.log(view_end_month)
    console.log(view_end_year)
    console.log(view_day)
    console.log(view_month)
    console.log(view_year)
    let end_day_length = view_end_day.length;
    let end_month_length = view_end_month.length;
    let end_year_length = view_end_year.length;	

    // Input being set appropriately since this takes a date as an input and giving a date makes it run once and breaks. Giving an expression makes it run repeatedly
    // let date = new Date();
    // date.setDate(parseInt(`${view_day}`));
    // date.setMonth(`${view_month}`);
    // date.setFullYear(view_year);


    // // To get the current date and compare it with the date entered. Proceeds only if the entered date is equal or greater than the current date
    // var q = new Date();
    // var m = q.getMonth();
    // var d = q.getDate();
    // var y = q.getFullYear();

    // var current_date = new Date(y,m,d);

    // Error handling for show meetings command. If user makes an error, making the command_list array empty so that the user starts over again
    if(parseInt(`${view_end_day}`) < 1 || parseInt(`${view_end_day}`) > 31  || parseInt(`${view_end_month}`) < 0 || parseInt(`${view_end_month}`) > 12)
    { 
        client.postMessage("Please enter a valid end date following the format! Try again or enter stop to terminate the process", channel);
//        command_list.splice(0, command_list.length);
        command_list.pop();


        //displayViewCalendarMessagestartTime(msg);
    	console.log("Check Error Case 1");
    }
    else if((end_day_length!==2))
    {
        client.postMessage("Please check day format. Enter Day as DD, Try again or enter stop to terminate the process",channel)
 //        command_list.splice(0, command_list.length);
        command_list.pop();
	console.log("Error Case 4 is passing in. Checking Day format");
    }

    else if((end_month_length!==2))
    {
        client.postMessage("Please check month format. Enter Month as MM, Try again or enter stop to terminate the process",channel)
    //    command_list.splice(0, command_list.length);
        command_list.pop();

	console.log("Error Case 5 is passing in. Checking Month format");
    }
        else if((end_year_length!==4))
    {
        client.postMessage("Please check year format. Enter Month as YYYY, Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
        command_list.pop();

	 console.log("Error Case 6 is passing in. Checking Year format");
    }


    else if(parseInt(`${view_end_day}`) < parseInt(`${view_day}`) && parseInt(`${view_end_month}`) < parseInt(`${view_month}`) && parseInt(`${view_end_year}`) < parseInt(`${view_year}`))
    { 
        client.postMessage("End Date cannot precede Start Date! Try again or enter stop to terminate the process", channel);
//    	    command_list.splice(0, command_list.length);
        command_list.pop();

	console.log("Check Error case 2");
    }
   
    else if((parseInt(`${view_end_month}`)==2) && (parseInt(`${view_end_day}`)>28))
     {
	client.postMessage("Please recheck date range for February, Try again or enter stop to terminate the process")
//	command_list.splice(0, command_list.length);
        command_list.pop();

	console.log("Error Case 3 is passing in. Case February!");
     }
     
    else
    {
    	client.postMessage("\u261B Enter End time of event: Use the format HH:MM", channel);

    }
}
async function getEventFuncFromCalendarJs(msg)      
{   
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    view_end_time =  post.message;
    let items_to_show = [];

    // Error handling

   
    let view_end_time_test2 = view_end_time
    console.log(view_end_time_test2)
    let view_end_time_test = view_end_time_test2.split(':');
   // let view_end_hour_length=view_end_hour.length;
   // let view_end_minutes_length = view_end_minutes.length;

    
    // Generate a date for these details here from user input

    let view_end_minutes = view_end_time_test[1];
    let view_end_hour= view_end_time_test[0];
    console.log(view_end_minutes)
    console.log(view_end_hour)
    let view_end_hour_length=view_end_hour.length;
    let view_end_minutes_length = view_end_minutes.length;


    if(parseInt(`${view_end_hour}`) < 1 || parseInt(`${view_end_hour}`) > 23  || parseInt(`${view_end_minutes}`) < 0 || parseInt(`${view_end_minutes}`) > 59 )
    { 
        client.postMessage("Please enter a valid end time following the format! Try again or enter stop to terminate the process", channel);
//        command_list.splice(0, command_list.length);
        command_list.pop();

    }

    else if((view_end_hour_length!==2))
    {
        client.postMessage("Please check 'hours' format. Enter hours as 'HH', Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
        command_list.pop();

	  console.log("Error Case 2 is passing in. Checking Hour format");
    }
        else if((view_end_minutes_length!==2))
    {
        client.postMessage("Please check 'minutes' format. Enter minutes as 'MM',Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
        command_list.pop();

	 console.log("Error Case 3 is passing in. Checking minutes format");
    }

    
    else
    {
    view_start_delimiter = view_start_date.concat("T");
    start_event = view_start_delimiter.concat(view_start_time);
    start_event=start_event.concat(":00.000-04:00")
    console.log(start_event);



    //function to concat end date and time in correct format

    view_end_delimiter = view_end_date.concat("T");
    end_event = view_end_delimiter.concat(view_end_time);
    end_event=end_event.concat(":00.000-04:00")
    console.log(end_event);

        items_to_show = await getEvents(start_event, end_event);
        if(items_to_show != "not okay")
        {   
            for(var i = 0; i < items_to_show.length; i++)
            {   
                let item_to_show_split = items_to_show[i].split(":");
                // let id_to_show = "\u2022 ID: ".concat(item_to_show_split[0])
                let meeting_to_show = "Meeting Name: ".concat(item_to_show_split[1]); 
                client.postMessage(`\u2192 ${meeting_to_show}`, channel);
            }
    }
    else 
        {
            client.postMessage("Unable to fetch your meetings, please try again!", channel);
	    command_list.splice(0, command_list.length);

        } 
    }  
}

async function displayCreateCalendarMessage(msg)
{ 
    let channel = msg.broadcast.channel_id;
    client.postMessage("\u261B Enter Name of event: ", channel);
}

async function displayCreateCalendarMessagestartDate(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    event =  post.message;
    client.postMessage("\u261B Enter Start date of event: Use the format YYYY-MM-DD, Try again or enter stop to terminate the process", channel);
}

async function displayCreateCalendarMessagestartTime(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    start_date =  post.message;
    let create_start_date_test2=start_date
    let create_start_date_test = create_start_date_test2.split('-');
   

    // Generate a date for these details here from user input
    let create_start_day = create_start_date_test[2];
    let create_start_month= create_start_date_test[1];
    let create_start_year = create_start_date_test[0];
   // console.log(create_start_day)
   // console.log(create_start_month)
   // console.log(create_start_year)
    let create_start_day_length = create_start_day.length;
    let create_start_month_length = create_start_month.length;
    let create_start_year_length = create_start_year.length;

    if(parseInt(`${create_start_day}`) < 1 || parseInt(`${create_start_day}`) > 31  || parseInt(`${create_start_month}`) < 0 || parseInt(`${create_start_month}`) > 12  )
    {
        client.postMessage("Please enter a valid date time following the format! Try again or enter stop to terminate the process", channel);
//        command_list.splice(0, command_list.length);
        command_list.pop();

	// command_list.push("show meetings")
        // displayViewCalendarMessagestartTime(msg);

    }
        else if((create_start_day_length!==2))
    {
        client.postMessage("Please check day format. Enter Day as DD, Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
        command_list.pop();
        

        console.log("Error Case 4 is passing in. Checking Day format");
    }

    else if((create_start_month_length!==2))
    {
        client.postMessage("Please check month format. Enter Month as MM, Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
        command_list.pop();

	   console.log("Error Case 5 is passing in. Checking Month format");
    }
        else if((create_start_year_length!==4))
    {
        client.postMessage("Please check year format. Enter Month as YYYY, Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
        command_list.pop();

	 console.log("Error Case 6 is passing in. Checking Year format");
    }
    else
    {
    client.postMessage("\u261B Enter Start time of event: Use the format HH:MM", channel);
    }
}
async function displayCreateCalendarMessageendDate(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    start_time =  post.message;
    let create_start_time_test2 = start_time
    console.log(create_start_time_test2)
    let create_start_time_test = create_start_time_test2.split(':');

    // Generate a date for these details here from user input
    let create_start_minutes = create_start_time_test[1];
    let create_start_hour= create_start_time_test[0];
    console.log(create_start_minutes)
    console.log(create_start_hour)
    let create_start_hour_length=create_start_hour.length;
    let create_start_minutes_length = create_start_minutes.length;

    if(parseInt(`${create_start_hour}`) < 1 || parseInt(`${create_start_hour}`) > 23  || parseInt(`${create_start_minutes}`) < 0 || parseInt(`${create_start_minutes}`) > 59 )
    {
        client.postMessage("Please enter a valid time following the format! Try again or enter stop to terminate the process", channel);
        command_list.pop();

        //        command_list.splice(0, command_list.length);

    }
    else if((create_start_hour_length!==2))
    {
        client.postMessage("Please check 'hours' format. Enter hours as 'HH', Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
          command_list.pop();

            console.log("Error Case 2 is passing in. Checking Hour format");
    }
        else if((create_start_minutes_length!==2))
    {
        client.postMessage("Please check 'minutes' format. Enter minutes as 'MM', Try again or enter stop to terminate the process",channel)
        command_list.pop();

            //        command_list.splice(0, command_list.length);
        console.log("Error Case 3 is passing in. Checking minutes format");
    }

    else{	
          client.postMessage("\u261B Enter End date of event: Use the format YYYY-MM-DD, Try again or enter stop to terminate the process", channel);
	}
}

async function displayCreateCalendarMessageendTime(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    end_date =  post.message;    
    let create_end_date_test2=end_date
    let create_end_date_test = create_end_date_test2.split('-');
    let create_end_day_int = ""
    let create_end_day_str= "";
    // Generate a date for these details here from user input
    let create_end_day = create_end_date_test[2];
    let create_end_month= create_end_date_test[1];
    let create_end_year = create_end_date_test[0];
   // console.log(create_start_day)
   // console.log(create_start_month)
   // console.log(create_start_year)
    let create_end_day_length = create_end_day.length;
    let create_end_month_length = create_end_month.length;
    let create_end_year_length = create_end_year.length;
   // create_end_day = parseInt((('${create_end_day}') + 04) % 24 );
   // create_end_day_int = parseInt('${create_end_day}')
   // create_end_day = ((create_end_day_int + 4) % 24 );
   // create_end_day_str = String(create_end_day)
   // end_date = create_end_year + "-" + create_end_month + "-" + create_end_day;
    if(parseInt(`${create_end_day}`) < 1 || parseInt(`${create_end_day}`) > 31  || parseInt(`${create_end_month}`) < 0 || parseInt(`${create_end_month}`) > 12  )
    {
        client.postMessage("Please enter a valid date time following the format! Try again or enter stop to terminate the process", channel);
//        command_list.splice(0, command_list.length);
        // command_list.push("show meetings")
        // displayViewCalendarMessagestartTime(msg);

        command_list.pop();
	    
    }
        else if((create_end_day_length!==2))
    {
        client.postMessage("Please check day format. Enter Day as DD, Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
        command_list.pop();

	   console.log("Error Case 4 is passing in. Checking Day format");
    }

    else if((create_end_month_length!==2))
    {
        client.postMessage("Please check month format. Enter Month as MM, Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
        command_list.pop();

	  console.log("Error Case 5 is passing in. Checking Month format");
    }
        else if((create_end_year_length!==4))
    {
        client.postMessage("Please check year format. Enter year as YYYY, Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
        command_list.pop();

	 console.log("Error Case 6 is passing in. Checking Year format");
    }
    else
    {
    client.postMessage("\u261B Enter End time of event: Use the format HH:MM, Try again or enter stop to terminate the process" , channel);
    }
}
async function displayCreateCalendarMessagedesc(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    end_time =  post.message;
    let create_end_time_test2 = end_time
    console.log(create_end_time_test2)
    let create_end_time_test = create_end_time_test2.split(':');

    // Generate a date for these details here from user input
    let create_end_minutes = create_end_time_test[1];
    let create_end_hour= create_end_time_test[0];
    console.log(create_end_minutes)
    console.log(create_end_hour)
    let create_end_hour_length=create_end_hour.length;
    let create_end_minutes_length = create_end_minutes.length;

    if(parseInt(`${create_end_hour}`) < 1 || parseInt(`${create_end_hour}`) > 23  || parseInt(`${create_end_minutes}`) < 0 || parseInt(`${create_end_minutes}`) > 59 )
    {
        client.postMessage("Please enter a valid time following the format! Try again or enter stop to terminate the process", channel);
        command_list.pop();

        //        command_list.splice(0, command_list.length);

    }
    else if((create_end_hour_length!==2))
    {
        client.postMessage("Please check 'hours' format. Enter hours as 'HH', Try again or enter stop to terminate the process",channel)
//        command_list.splice(0, command_list.length);
          command_list.pop();

            console.log("Error Case 2 is passing in. Checking Hour format");
    }
        else if((create_end_minutes_length!==2))
    {
        client.postMessage("Please check 'minutes' format. Enter minutes as 'MM', Try again or enter stop to terminate the process",channel)
        command_list.pop();

            //        command_list.splice(0, command_list.length);
        console.log("Error Case 3 is passing in. Checking minutes format");
    }

     else{		
     client.postMessage("\u261B Enter a brief description of event: ", channel);
         }
}

async function createCalendarPayload(msg)
{   
    
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    desc = post.message;
    
    //function to concat start date and time in correct format

    start_delimiter = start_date.concat("T");
    start = start_delimiter.concat(start_time);
    start=start.concat(":00.000-04:00")
    console.log(start);



    //function to concat end date and time in correct format

    end_delimiter = end_date.concat("T");
    end = end_delimiter.concat(end_time);
    end=end.concat(":00.000-04:00")
    console.log(end);

    //cal_payload = post.message;
    let status_of_api = await createcalEvent(event, desc, start, end).catch( (err) => {
        client.postMessage("Unable to complete request, sorry!", channel);
        command_list.splice(0,command_list.length); 
    });
    if(status_of_api == 200)
    {
        client.postMessage("Meeting/Event has been created in your calendar! Enter View Meetings to display scheduled meetings", channel);
    }
    else if(status_of_api == "not okay" || status_of_api == "failed in catch")
    {
        client.postMessage("Unable to Create meeting, please try again!", channel);
        command_list.splice(0, command_list.length);
    }
}

(async () => 
{

    await main();

})()
