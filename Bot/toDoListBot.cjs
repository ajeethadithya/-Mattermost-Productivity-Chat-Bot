const axios = require('axios');
// import "axios";
// import "chalk";
const chalk = require('chalk');

var config = {}
// Retrieve our api token from the environment variables.
config.token = process.env.GITHUBTOKEN;
var urlRoot = "https://github.ncsu.edu/api/v3"

if( !config.token )
{
	console.log(chalk`{red.bold GITHUBTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

function getDefaultOptions(endpoint, method)
{
  
	var options = {
		url: urlRoot + endpoint,
		method: method,
		headers: {
			"User-Agent": "ToDoList",
			"content-type": "application/json",
			"Authorization": `token ${config.token}`,
			"accept": "application/vnd.github.v3+json"
		}
	};
	return options;
}

// Function to get all repos of the user
function listAuthenicatedUserRepos()
{
	let options = getDefaultOptions("/user/repos?visibility=all", "GET");	

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		axios(options)
			.then(function (response) {
				var data = response.data;
        const repo_name = [];
				for( var i = 0; i < data.length; i++ )
				{
					repo_name.push(data[i].name);
					//console.log(name);
				}
				resolve(Object.values(repo_name));
			})
			.catch(function (error) {
				console.log(chalk.red(error));
				reject(error);
				return; // Terminate execution.
		});
	});
};


// Function to get issues and display it
function getIssues(owner, repo)
{ 
  let options = getDefaultOptions(`/repos/` + owner + '/' + repo + '/' + 'issues?state=open' , "GET");

  // Making a call using axios
  return new Promise(function(resolve, reject)
  {
    axios(options)
      .then(function (response) {
        data = response.data
        //console.log(data);
        var issue_list = [];
        for(var i = 0; i < data.length; i++)
        {
          issue_list.push(data[i].title + ": " + data[i].body + "   ID: " + " " + data[i].id);
        }
        resolve(issue_list);
        
      })
      .catch(function (error) {
        //console.log(chalk.red(error));
        reject(error);
        return; // Terminate Execution
      });
  });
}

// Function to get issues for closeIssues
function getIssuesForClosing(owner, repo, issue_id)
{ 
  let options = getDefaultOptions(`/repos/` + owner + '/' + repo + '/' + 'issues?state=open' , "GET");

  // Making a call using axios
  return new Promise(function(resolve, reject)
  {
    axios(options)
      .then(function (response) {
        data = response.data
        //console.log(data);
        for(var i = 0; i < data.length; i++)
        {
          if(issue_id == data[i].id)
          {
            var issue_number = data[i].number;
            break; 
          }
        }
        resolve(issue_number);
        
      })
      .catch(function (error) {
        //console.log(chalk.red(error));
        reject(error);
        return; // Terminate Execution
      });
  });
}


// Function to close issues
async function closeIssues(owner, repo, issue_id)
{ 
  var issue_number = await getIssuesForClosing(owner, repo, issue_id).catch( 
    err => console.error(`No issue in ${repo}`) );

  let options = getDefaultOptions(`/repos/` + owner + '/' + repo + '/' + 'issues/' + issue_number, "PATCH");
  options['data'] = {state: 'closed'}  
  // Making a call using axios
  return new Promise(function(resolve, reject)
  {
    axios(options)
      .then(function (response) {
        return_status = response.status
        //console.log(response.data);
        resolve(return_status);
        
      })
      .catch(function (error) {
        //console.log(chalk.red(error));
        reject(error);
        return; // Terminate Execution
      });
  });
}

async function createIssue(owner, repo, issueName, issueBody)
{
	let options = getDefaultOptions(`/repos/` + owner + '/' + repo + '/' + 'issues' , "POST");
	options['data'] = {title: issueName, body: issueBody};

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		axios(options)
			.then(function (response) {
				resolve(response.status);
		})
		.catch((error) => {
			console.log(chalk.red(error));
			reject(error);
			return;
		});
	});
}

async function getUser()
{	
	let options = getDefaultOptions("/user", "GET");

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		axios(options)
			.then(function (response) {
				var userId = response.data.login;
				//console.log(userId);
				resolve(userId);
		})
    .catch((error) => {
			console.log(chalk.red(error));
			reject(error);
			return;
		});
	});
}



exports.getIssues = getIssues;
exports.listAuthenicatedUserRepos = listAuthenicatedUserRepos;
exports.closeIssues = closeIssues;
exports.createIssue = createIssue;
exports.getUser = getUser;

// (async () => {
//     console.log("Inside async");
//     let iss = await getIssues();
//     console.log(iss);
// })();