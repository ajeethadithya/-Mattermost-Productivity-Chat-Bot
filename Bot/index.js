// Instructions to make commands through the Mattermost Server:
// show issues | type repo name that is displayed | issues in that repo is displayed
// close issue | type repo name that is displayed | issues with ID displayed | type ID to remove
// create issue | Enter +{repo name} | Enter ++{Issue Title} | Enter +++{Issue Body}"
// show todo | if todo list exists, displays else says nothing there 
// add todo | type task with hyphen in front of it | responds with added message
// remove todo | shows todo list and asks you to enter a number to remove | removes task 

// Importing necessary packages and js files
// Database connectivity
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get, update, remove } from "firebase/database";
import Client from "mattermost-client";
import "./toDoListBot.cjs";
import {listAuthenicatedUserRepos, getIssues, closeIssues, createIssue, getUser} from "./toDoListBot.cjs";
//import cron from "node-cron";
// const Client = require('mattermost-client');
// const toDoListBot = require('./toDoListBot');

// Credentials needed for Database Connectivity
const firebaseApp = initializeApp({
    apiKey: "AIzaSyBcx5qVBh6obpe3tGDywWQV_4-crwOgcKo",
    authDomain: "fir-test-4c03b.firebaseapp.com",
    projectId: "fir-test-4c03b",
    storageBucket: "fir-test-4c03b.appspot.com",
    messagingSenderId: "386868535333",
    appId: "1:386868535333:web:dbb791c704ed3622049fcc",
    measurementId: "G-NQTNG31BYM"
  });
  
const db = getDatabase();
const dbRef = ref(getDatabase());

let host = "chat.robotcodelab.com"
let group = "CSC510-S22"
let bot_name = "focus-bot"
let client = new Client(host, group, {});

// Global list to store the list of repo names to be used to call the listIssues function.
let repo_names = []
// To access the issue number with repo name and issue ID entered
let req_repo_name = ""
let global_issues = []
let issue_id = 0;
var todoList = []
let repo_name_for_create_issue = ""
let issue_title = ""
let issue_body = ""
// To keep track the chain of commands
let command_list = [] 
let userID = ""

async function main()
{   

    // To check if the current user exists in the database or not
    checkUserInDB();
    let request = await client.tokenLogin(process.env.BOTTOKEN);
    //console.log("REQUEST DATA" ,request);
    //console.log("CLIENT DATA: ", client);
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
            listIssues(msg)
            command_list.pop();           
        }
        else if(hears(msg, "close issue"))
        {
            listRepos(msg);
            command_list.push("close issue");
        }
        else if(command_list[0] == "close issue" && hearsForRepoName(msg, "dummy"))
        {   
            listIssues(msg)
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
        else if(command_list[0] == "add todo" && hearsTaskToAdd(msg))
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
                    client.postMessage("There is nothing to show!", channel);
                }
                else
                {
                    for(var i= 1; i < temp_todo_list.length; i++)
                    {
                        client.postMessage(temp_todo_list[i], channel);
                    }
                    client.postMessage("Enter the task number that you want to remove", channel);
                } 
                }).catch((error) => {
                console.error(error);
            });
        }
        else if(command_list[0] == "remove todo" && hearsForTaskNumber(msg))
        {   
            removeTodo(msg);    
            command_list.pop();
        }
        else if(hears(msg, "create issue"))
        {
            displayCreateIssue(msg);
            command_list.push("create issue");
        }
        else if(command_list[0] == "create issue" && hearsRepoNameForCreateIssue(msg))
        {   
            displayNextMsgForCreateIssue(msg);
            command_list.push("Repo name entered")
        }
        else if(command_list[0] == "create issue" && command_list[1] == "Repo name entered" && hearsForIssueTitle(msg))
        {
            displayThirdMsgForCreateIssue(msg);
            command_list.push("Issue title entered");
        }
        else if(command_list[0] == "create issue" && command_list[1] == "Repo name entered" && command_list[2] == "Issue title entered" && hearsForIssueBody(msg))
        {
            createIssueBody(msg, issue_title, repo_name_for_create_issue);
            command_list.splice(0, command_list.length);
        }
        else if(hears(msg, "help"))
        {
            displayHelpWithCommands(msg);
        }
        else
        {
            console.error("ENTER VALID INPUT- Type help for list of commands and instructions");
        }

    });

}

async function checkUserInDB()
{
    // Getting userID using github api to get users that is common in github and mattermost as a pre-condition and checking to see if that userID exists in the database
    userID = await getUser().catch( 
        err => console.log("Unable to get UserID") );
    
    //read from Firebase to check if user exists or not
    get(child(dbRef, `users/` + userID)).then((snapshot) => {
    if (!snapshot.exists()) 
    {
      //console.log(snapshot.val());
      //write to Firebase
      set(ref(db, 'users/' + userID), {
          todo_list: ["temp"]
        });
    }
    }).catch((error) => {
    console.error(error);
    });
}

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

function hearsForRepoName(msg, text)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {   
        let post = JSON.parse(msg.data.post);
        //console.log(repo);
        // To store the list of repo_names as a string that is used to check if the user input repo_name is a valid one
        let repos = Object.values(repo_names);
        for(var i = 0 ; i < repos.length; i++)
        {   
            text = repos[i]
            if( post.message === text)
            {
                return true;
            }
        }
        
    }
    return false;
}

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

function hearsTaskToAdd(msg)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {
        let post = JSON.parse(msg.data.post);
        if( post.message.charAt(0) === '-')
        {
            return true;
        }
    }
    return false;
}

// function hearsTaskToAdd(msg)
// {
//     if( msg.data.sender_name == bot_name) return false;
//     if( msg.data.post )
//     {
//         let post = JSON.parse(msg.data.post);
//         if( post.message != '')
//         {
//             return true;
//         }
//     }
//     return false;
// }


function hearsForTaskNumber(msg)
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

function hearsRepoNameForCreateIssue(msg)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {
        let post = JSON.parse(msg.data.post);
        if( post.message.charAt(0) === '+' && post.message.charAt(1) != '+')
        {
            return true;
        }
    }
    return false;
}

function hearsForIssueTitle(msg)
{
    if( msg.data.sender_name == bot_name) return false;
    if(msg.data.post)
    {   let post = JSON.parse(msg.data.post);
        if( post.message.charAt(0) == '+' && post.message.charAt(1) == '+' && post.message.charAt(2) != '+')
        {
            return true;
        }
    }
    
    return false;
}

function hearsForIssueBody(msg)
{
    if( msg.data.sender_name == bot_name) return false;
    if(msg.data.post)
    {   let post = JSON.parse(msg.data.post);
        if( post.message.charAt(0) == '+' && post.message.charAt(1) == '+' && post.message.charAt(2) == '+')
        {
            return true;
        }
    }
    
    return false;
}


function greetingsReply(msg)
{
    let channel = msg.broadcast.channel_id;
    client.postMessage("Good to see you here! Hocus Focus- Let's help you Focus!", channel);   
}

function displayHelpWithCommands(msg)
{
    let channel = msg.broadcast.channel_id;
    client.postMessage("Command: show issues | Enter repo name from list | Issues with ID displayed", channel);
    client.postMessage("Command: close issue | Enter repo name from list | Issues with ID displayed | Enter ID of issue to remove", channel);
    client.postMessage("Command: create issue | Enter +{repo name} | Enter ++{Issue Title} | Enter +++{Issue Body}", channel);
    client.postMessage("Command: show todo | if todo list exists, displays else says nothing there", channel);
    client.postMessage("Command: add todo | -{task name} i.e type with hyphen in front", channel);
    client.postMessage("Command: remove todo | {number of task shown} | removes task", channel); 
}

async function listRepos(msg)
{   
    //let owner = msg.data.sender_name.replace('@', '');
    let channel = msg.broadcast.channel_id;
    client.postMessage("Enter the repo name for which you want to execute the command: ", channel);
    repo_names = await listAuthenicatedUserRepos().catch( 
        err => client.postMessage("Unable to complete request, sorry!", channel) );

    client.postMessage(JSON.stringify(repo_names, null, 4), channel);
}
    
async function listIssues(msg)
{   
    let owner = msg.data.sender_name.replace('@', '');
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    req_repo_name = post.message;
    let issue = await getIssues(owner, req_repo_name).catch( 
        err => client.postMessage(`No issue in ${req_repo_name}`, channel) );
    global_issues = issue;
    if(issue)
    {   
        for(var i = 0; i < issue.length; i++)
        {
            client.postMessage(issue[i], channel);
        }
        //client.postMessage("Enter issue ID is it is a close issue command", channel);
        
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
    var closeStatus = await closeIssues(owner, req_repo_name, issue_id).catch( 
            err => client.postMessage(`Issue cannot be closed`));
        if( closeStatus )
        {   console.log("close status is " + closeStatus);
            client.postMessage(`Issue has been successfully closed!`, channel);
        }
}

// async function showTodo(msg)
// {
//     let channel = msg.broadcast.channel_id;
//     if (todoList.length === 0) 
//     { 
//         client.postMessage("There is nothing to show!", channel);
//     }
//     else
//     {   for(var i=0; i < todoList.length; i++)
//         {
//             client.postMessage(todoList[i], channel);
//         }
        
//     }

// }

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
            client.postMessage("There is nothing to show!", channel);
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
    client.postMessage("Enter the task to be added with a hyphen before it (-task_one): ", channel);
}

// async function addTodo(msg)
// {
//     let channel = msg.broadcast.channel_id;
//     var todo_id = todoList.length + 1;
//     let post = JSON.parse(msg.data.post);
//     var message_to_push = post.message;
//     //console.log(message_to_push);
//     // Replace is not working
//     message_to_push = message_to_push.replace(message_to_push.charAt(0), "");
//     message_to_push = todo_id.toString().concat("."," ").concat(post.message);
//     // fs.appendFile("taskList.txt", message_to_push + os.EOL, (err) => {
//     //     if (err) {console.log(err);}
//     //     else {client.postMessage("Task added!", channel);}
//     todoList.push(message_to_push);
//     client.postMessage("Task added!", channel);
// }

async function addTodo(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    var message_to_push = post.message;
    message_to_push = message_to_push.replace(message_to_push.charAt(0), "");

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
    const user_todo_data = {todo_list: temp_todo_list};
    const updates = {};
    updates[`/users/` + userID] = user_todo_data;
    update(ref(db), updates);
    
    // This was using a global list called todoList
    //todoList.push(message_to_push);
    client.postMessage("Task added!", channel);
}



// async function displayRemoveTodo(msg)
// {
//     let channel = msg.broadcast.channel_id;
//     //client.postMessage("Enter the number of the task that you want to remove:  ", channel);
//     showTodo(msg);
// }

async function removeTodo(msg)
{   
    let channel = msg.broadcast.channel_id;
    let temp_todo_list = []
    let post = JSON.parse(msg.data.post);
    var task_id_to_remove = parseInt(post.message);
    await get(child(dbRef, `users/` + userID)).then((snapshot) => {
        if (snapshot.exists()) 
        {
            temp_todo_list = snapshot.val().todo_list;
            var removed = temp_todo_list.splice(task_id_to_remove, 1);
            for(var i = 1; i < temp_todo_list.length; i++)
            {
                temp_todo_list[i] = temp_todo_list[i].replace(temp_todo_list[i].charAt(0), "");
                temp_todo_list[i] = i.toString().concat(temp_todo_list[i]);
            }
        } 
        }).catch((error) => {
        console.error(error);
    });

    //update data
    const user_todo_data = {todo_list: temp_todo_list};
    const updates = {};
    updates[`/users/` + userID] = user_todo_data;
    update(ref(db), updates);    
    client.postMessage("Task " + post.message + " successfully removed", channel);
}

async function displayCreateIssue(msg)
{
    let channel = msg.broadcast.channel_id;
    client.postMessage("Enter a repo to create an issue from the list below: ", channel);
    await listRepos(msg);
    client.postMessage("Use + before entering the repo name", channel);
}

async function displayNextMsgForCreateIssue(msg)
{   
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    repo_name_for_create_issue =  post.message;
    repo_name_for_create_issue = repo_name_for_create_issue.replace(repo_name_for_create_issue.charAt(0), "");
    client.postMessage("Enter the Title of the issue with ++ infront of it", channel);
}

async function displayThirdMsgForCreateIssue(msg)
{
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    issue_title =  post.message;
    issue_title = issue_title.replace(issue_title.charAt(0), "");
    issue_title = issue_title.replace(issue_title.charAt(0), "");
    client.postMessage("Enter the body of the issue with +++ infront of it", channel);
}

async function createIssueBody(msg, issue_title, repo_name_for_create_issue)
{   
    let owner = msg.data.sender_name.replace('@', '');
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    issue_body = post.message;
    issue_body = issue_body.replace(issue_body.charAt(0), "");
    issue_body = issue_body.replace(issue_body.charAt(0), "");
    issue_body = issue_body.replace(issue_body.charAt(0), "");
    let status_of_api = await createIssue(owner, repo_name_for_create_issue, issue_title, issue_body).catch( 
        err => client.postMessage("Unable to complete request, sorry!", channel) );
    if(status_of_api)
    {
        client.postMessage("Issue has been created!", channel);
    }
}
(async () => 
{

    await main();

})()
