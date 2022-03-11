const axios = require('axios');
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

// Function to close issues
function closeIssues(owner, issue_id)
{ 
  // Need to make a call to the database to get the repository name and the issue number 
  let options = getDefaultOptions(`/repos/` + owner + '/' + repo + '/' + 'issues/' + issue_id + '?state=closed' , "PATCH");

  // Making a call using axios
  return new Promise(function(resolve, reject)
  {
    axios(options)
      .then(function (response) {
        return_status = response.status
        console.log(data);
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


exports.getIssues = getIssues;
exports.listAuthenicatedUserRepos = listAuthenicatedUserRepos;

// (async () => {
//     console.log("Inside async");
//     let iss = await getIssues();
//     console.log(iss);
// })();