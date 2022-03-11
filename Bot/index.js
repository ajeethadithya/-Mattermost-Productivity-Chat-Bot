const Client = require('mattermost-client');

const toDoListBot = require('./toDoListBot');

let host = "chat.robotcodelab.com"
let group = "CSC510-S22"
let bot_name = "weather-bot";
let client = new Client(host, group, {});

//  curl -i -X POST -H 'Content-Type: application/json' -d '{"channel_id":"tunithmojpbyxbt77pg8hirqbc", "message":"This is a message from a bot", "props":{"attachments": [{"pretext": "Look some text","text": "This is text"}]}}' -H 'Authorization: Bearer 4eqq51jr1b8n5ytftbcs8auz9a' https://chat.robotcodelab.com/api/v4/posts

// Global list to store the list of repo names to be used to call the listIssues function.
let repo_names = []

async function main()
{
    let request = await client.tokenLogin(process.env.BOTTOKEN);
    
    client.on('message', function(msg)
    {
        console.log(msg);
        if(hears(msg, "Hi") || hears(msg, "hi") || hears(msg, "Hello"))
        {   
            greetingsReply(msg);
        }
        if(hears(msg, "show issues"))
        {
            listRepos(msg);            
        }
        if(hears(msg, repo_names[i]))
        {
                listIssues(msg);
        }
        
        // else if( hears(msg, "close issue"))
        // {
        //     closeIssueCommand(msg);
        // }
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

function greetingsReply(msg)
{
    let channel = msg.broadcast.channel_id;
    client.postMessage("Good to see you here!", channel);   
}

async function listRepos(msg)
{   
    //let owner = msg.data.sender_name.replace('@', '');
    let channel = msg.broadcast.channel_id;
    client.postMessage("Enter the repo name from which you want to see your issues", channel);
    let repo_names = await toDoListBot.listAuthenicatedUserRepos().catch( 
        err => client.postMessage("Unable to get Issues, sorry!", channel) );
    console.log(repo_names)
    //console.log(Object.values(repo_names));
    client.postMessage(JSON.stringify(repo_names, null, 4), channel);
}


    
async function listIssues(msg)
{   
    let owner = msg.data.sender_name.replace('@', '');
    let channel = msg.broadcast.channel_id;
    let post = JSON.parse(msg.data.post);
    let req_repo_name = post.message;
    let issue = await toDoListBot.getIssues(owner, req_repo_name).catch( 
        err => client.postMessage(`No issue in ${req_repo_name}`, channel) );
    console.log(issue)
    if(issue)
    {   
        for(var i = 0; i < issue.length; i++)
        {
            client.postMessage(issue[i], channel);
        }
        
    }   
}

// async function closeIssueCommand(msg)
// {   
    
//     let owner = msg.data.sender_name.replace('@', '');
//     let channel = msg.broadcast.channel_id;
//     let post = JSON.parse(msg.data.post).message;
//     const temp_array = post.split(" ");
//     let issue_id_to_close = parseInt(temp_array[1]);
//     var closeStatus = await toDoListBot.closeIssues(owner, issue_id_to_close).catch( 
//             err => console.error(`Issue cannot be close`));
//         if( closeStatus )
//         {
//             client.postMessage(`Issue has been successfully closed!`, channel);
//         }
// }


(async () => 
{

    await main();

})()
