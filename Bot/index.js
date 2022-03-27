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

async function main()
{   

    // To check if the current user exists in the database or not
    checkUserInDB();
    // To send a welcome message the moment the code is run, using axios to post a message to a given ID
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
    console.log(response.data);
    })
    .catch(function (error) {
    console.log((error));
    }); 

    let request = await client.tokenLogin(process.env.FOCUSBOTTOKEN);
    client.on('message', function(msg)
    {
        //console.log(msg);
        if(hears(msg, "Hi") || hears(msg, "hi") || hears(msg, "Hello"))
        {   
            greetingsReply(msg);
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
        else
        {   
            let channel = msg.broadcast.channel_id;
            if( msg.data.sender_name != bot_name && (command_list[0] == "show issues" || command_list[0] == "close issue" || command_list[0] == "create issue") && command_list[1] != "repo name entered for closing issue" )
            {   
                // Error handling for repo name not matching with the list of repo names for that user
                client.postMessage("Repo name entered does not match with the ones given above, kindly start over", channel);
                command_list.splice(0, command_list.length);
            }
            else if( msg.data.sender_name != bot_name && (command_list[0] == "remove todo"))
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
          reminders: ["temp"]
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
            //console.log(temp_issue_id);

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
    if(date < current_date || (parseInt(`${cron_day}`) < 1 && parseInt(`${cron_day}`) > 31 ) || (parseInt(`${cron_month_minus_one}`) < 0 && parseInt(`${cron_day}`) > 11 ))
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

(async () => 
{

    await main();

})()
