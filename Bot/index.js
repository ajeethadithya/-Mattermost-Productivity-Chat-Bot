const Client = require('mattermost-client');

const toDoListBot = require('./toDoListBot');

let host = "chat.robotcodelab.com"
let group = "CSC510-S22"
let bot_name = "weather-bot";
let client = new Client(host, group, {});

async function main()
{
    let request = await client.tokenLogin(process.env.BOTTOKEN);
    
    client.on('message', function(msg)
    {
        console.log(msg);
        if( hears(msg, "show todo"))
        {
            displayToDoCommand(msg);            
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
        if( post.message.indexOf(text) >= 0)
        {
            return true;
        }
    }
    return false;
}

async function displayToDoCommand(msg)
{   let owner = msg.data.sender_name.replace('@', '');
    let channel = msg.broadcast.channel_id;
    let repo_names = await toDoListBot.listAuthenicatedUserRepos().catch( 
        err => client.postMessage("Unable to get Issues, sorry!", channel) ); 
    
    for (let i = 0; i < repo_names.length; i++) {   
        let issue = await toDoListBot.getIssues(owner, repo_names[i]).catch( 
            err => console.error(`No issue in ${repo_names[i]}`));
        if(issue)
        {   var message_to_post = `Repo Name: ${repo_names[i]}|||Issue: ${issue}`; 
            client.postMessage(message_to_post, channel);
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
