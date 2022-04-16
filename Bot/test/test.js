//var chai   = require('chai');
//const nock = require("nock");
import chai from "chai";
import nock from "nock";
import fs from "fs";

var assert = chai.assert,
    expect = chai.expect;



// Load mock data
//const data = require("../mock.json")

process.env.NODE_ENV = 'test'

//var bot = require('../index');
//var toDoListBot = require('../toDoListBot');
import { createIssueBody, displayCreateIssue, displayNextMsgForCreateIssue, displayThirdMsgForCreateIssue, greetingsReply, hears, hearsForNonEmptyString, hearsForNumber, hearsForRepoName, issue_title, listIssues, listRepos, repo_names, repo_name_for_create_issue, status_of_api, global_issues, closeIssueID, closeStatus, checkUserInDB, userID, showTodo, temp_todo_list, callClientPostMessage, hearsForIssueID, displayCreateReminderMessage } from '../index.js';
import {listAuthenicatedUserRepos, getIssues, getDefaultOptions, getUser, getIssuesForClosing, closeIssues } from '../toDoListBot.cjs';
import repo_name from "../toDoListBot.cjs";
//import { json } from "express/lib/response";


// Turn off logging
console.log = function(){};

describe("FocusBot Tests", function() {

 
    // CREATE TEST OBJECT
    let msg = {"data": {"sender_name": "test",
               "post": JSON.stringify({"message": "BotTest"})},
                "broadcast": {
                "omit_users": null,
                "user_id": "",
                "channel_id": "abcd", //sptfq15q83d5iexq9fygye18pc
                "team_id": "" 
                }};



    
    it("ensures that hears() returns false on empty input", function() {
        
        // CREATE TEST OBJECT
        msg = {"data": {"sender_name": ""}};
        let returnValue = hears(msg, "")
        assert(returnValue === false);
    });

    //hears function
    it("ensures that hears() returns true", function() {
        // CREATE TEST OBJECT
        msg = {"data": {"sender_name": "test",
               "post": JSON.stringify({"message": "show issues"})}};
        let returnValue = hears(msg, "show issues")
        assert(returnValue === true);
    });


    //hearsForNonEmptyString function
    it("ensures that hearsForNonEmptyString() returns true", function() {
        // CREATE TEST OBJECT
        msg = {"data": {"sender_name": "test",
               "post": JSON.stringify({"message": "show issues"})}};
        let returnValue = hearsForNonEmptyString(msg, "show issues")
        assert(returnValue === true);
    });


    //hearsForNumber function
    it("ensures that hearsForNumber() returns true", function() {
        // CREATE TEST OBJECT
        msg = {"data": {"sender_name": "test",
               "post": JSON.stringify({"message": "1234"})}};
        let returnValue = hearsForNumber(msg)
        assert(returnValue === true);
    });

    

    //hearsForRepoName function
    it("ensures that hearsForRepoName() returns false",  function() {
        // CREATE TEST OBJECT
        msg = { "data": {
                  "post": JSON.stringify({"message":["CSC501", "CSC548", "CSC600"]}),
                  "sender_name": "testUser" },
                "broadcast": { "channel_id": "abcd", }
            }

        var repoResponse = 
        [{ name: 'CSC-547', full_name: 'anaray23/CSC-501', },
        { name: 'BotTest',full_name: 'anaray23/BotTest', },
        { name: 'HW1-510', full_name: 'anaray23/HW1-510', }]
           
        //MOCK SERVICE
        var listReposIntercept= nock("https://github.ncsu.edu/api/v3")
        //.persist() // This will persist mock interception for lifetime of program.
        .get("/user/repos?visibility=all")
        .reply(200, repoResponse);

      
        const repoNameTest = [];
		for( var i = 0; i < repoResponse.length; i++ ) {
				repoNameTest.push(repoResponse[i].name);
					
			}
    
        listRepos(msg);
       
        let returnValue = hearsForRepoName(msg, "dummy")
        //assert(returnValue === true);
        expect(returnValue).to.equal(false);   

    });


       //hearsForIssueID function
    it("ensures that hearsForIssueID() returns false",  function() {
        // CREATE TEST OBJECT
        msg = { "data": {
                  "post": JSON.stringify({"message":["CSC501", "CSC548", "CSC600"]}),
                  "sender_name": "testUser" },
                "broadcast": { "channel_id": "abcd", }
            }

    
       
        let returnValue = hearsForIssueID(msg)
        expect(returnValue).to.equal(false);   

    });




    it("ensures that greetingsReply() returns 1", function() {
        
        // CREATE TEST OBJECT
        msg = { "data": {
            "post": {"message":["CSC501", "CSC548", "CSC600"]},
            "sender_name": "testUser" },
          "broadcast": { "channel_id": "abcd", }
        }

        let returnValue = greetingsReply(msg)
        expect(returnValue).to.equal(1); 
    });




    //getDefaultOptions function
    it("ensures that getDefaultOptions() returns true", function() {
        // CREATE TEST OBJECT
        
        msg = {"data": {"sender_name": "test",
               "post": JSON.stringify({"message": "show issues"})}};
        let returnValue = getDefaultOptions("/testuser/testrepo/test", "POST");
        let testValue = "https://github.ncsu.edu/api/v3/testuser/testrepo/test";
        let returnValueString = JSON.stringify(returnValue.url)
        returnValueString = returnValueString.replace(/['"]+/g, '');
        
        assert.equal(testValue ,returnValueString);
    });



     //callClientPostMessage function
     it("ensures that callClientPostMessage() returns 400", function() {
        
        let returnValue = callClientPostMessage("dummy", "dummy");
        assert.equal(returnValue , 400);
    });




    
    //listAuthenicatedUserRepos
   it("ensures that listAuthenicatedUserRepos() returns true", async () => {

        var repoResponse = 
        [{ name: 'HW0-510', full_name: 'anaray23/HW0-510', },
        { name: 'BotTest',full_name: 'anaray23/BotTest', },
        { name: 'HW1-510', full_name: 'anaray23/HW1-510', }]
    
        //MOCK SERVICE
        var listReposIntercept= nock("https://github.ncsu.edu/api/v3")
        //.persist() // This will persist mock interception for lifetime of program.
        .get("/user/repos?visibility=all")
        .reply(200, repoResponse);

        const repoNameTest = [];
		for( var i = 0; i < repoResponse.length; i++ ) {
				repoNameTest.push(repoResponse[i].name);
					//console.log(name);
			}

        await listAuthenicatedUserRepos().then(function(data) {
            expect(JSON.stringify(data)).to.equal(JSON.stringify(repoNameTest));     
        })
        
    });
    


    //getIssues
   it("ensures that getIssues() returns true", async () => {
        
        var issueResponse = 
        [ { title: 'HW0-501', body: 'Operating Systems', id: '0101' },
        { title: 'BotTest', body: 'Bot Testing', id: '1234' },
        { title: 'HW0-510', body: 'Software Engineering', id: '0551' } ]

        var issueListTest = [];
        for(var i = 0; i < issueResponse.length; i++) { 
          issueListTest.push(issueResponse[i].title + ":\n" + issueResponse[i].body + "   ID: " + " " + issueResponse[i].id);
        }

        //MOCK SERVICE
        var getIssuesIntercept = nock("https://github.ncsu.edu/api/v3")
        //.persist() // This will persist mock interception for lifetime of program.
        .get("/repos/testowner/testrepo/issues?state=open")
        .reply(200, issueResponse);

        await getIssues("testowner", "testrepo").then(function(data) {
            expect(JSON.stringify(data)).to.equal(JSON.stringify(issueListTest));     
        })
    });


    //getIssuesForClosing
   it("ensures that getIssuesForClosing() returns true", async () => {
        
        var issueResponse = 
        [ { title: 'HW0-501', body: 'Operating Systems', id: '0101', number: '143343' },
        { title: 'BotTest', body: 'Bot Testing', id: '1234', number: '143342', },
        { title: 'HW0-510', body: 'Software Engineering', id: '0551', number: '134243', } ]

        var issueListTest = [];
        for(var i = 0; i < issueResponse.length; i++) { 
        issueListTest.push(issueResponse[i].title + ":\n" + issueResponse[i].body + "   ID: " + " " + issueResponse[i].id);
        }

        //MOCK SERVICE
        var getIssuesForClosingIntercept = nock("https://github.ncsu.edu/api/v3")
        //.persist() // This will persist mock interception for lifetime of program.
        .get("/repos/testowner/testrepo/issues?state=open")
        .reply(200, issueResponse);

        await getIssuesForClosing("testowner", "testrepo", "1234").then(function(data) {
            expect(JSON.stringify(data)).to.equal(JSON.stringify("143342"));     
        })
    });


    //closeIssues
   it("ensures that closeIssues() returns true", async () => {
        
    var issueResponse = 
    [ { title: 'HW0-501', body: 'Operating Systems', id: '0101', number: '143343' },
    { title: 'BotTest', body: 'Bot Testing', id: '1234', number: '143342', },
    { title: 'HW0-510', body: 'Software Engineering', id: '0551', number: '134243', } ]

    //MOCK SERVICE
    var getIssuesForClosingIntercept = nock("https://github.ncsu.edu/api/v3")
    //.persist() // This will persist mock interception for lifetime of program.
    .get("/repos/testowner/testrepo/issues?state=open")
    .reply(200, issueResponse);

    //MOCK SERVICE
    var closIssuesIntercept = nock("https://github.ncsu.edu/api/v3")
    //.persist() // This will persist mock interception for lifetime of program.
    .intercept("/repos/testowner/testrepo/issues/143342", "patch")
    .reply(200, issueResponse);

    await closeIssues("testowner", "testrepo", "1234").then(function(data) {
        expect(JSON.stringify(data)).to.equal(JSON.stringify(200));     
    })
});




    //getUser
   it("ensures that getUser() returns true", async () => {
    var userResponse = 
    { login: "testUser" }
 
    //MOCK SERVICE
    var getUserIntercept = nock("https://github.ncsu.edu/api/v3")
    //.persist() // This will persist mock interception for lifetime of program.
    .get("/user")
    .reply(200, userResponse);

    await getUser().then(function(data) {
        expect(JSON.stringify(data)).to.equal(JSON.stringify(userResponse.login));     
    }) 
  
});





    //listRepos function
    it("ensures that listRepos() returns true", async () => {
        // CREATE TEST OBJECT
        msg = { "data": {
                  "post": {"message":["CSC501", "CSC548", "CSC600"]},
                  "sender_name": "testUser" },
                "broadcast": { "channel_id": "abcd", }
            }

        var repoResponse = 
        [{ name: 'CSC-501', full_name: 'anaray23/CSC-501', },
        { name: 'BotTest',full_name: 'anaray23/BotTest', },
        { name: 'HW1-510', full_name: 'anaray23/HW1-510', }]
           
        //MOCK SERVICE
        var listReposIntercept= nock("https://github.ncsu.edu/api/v3")
        //.persist() // This will persist mock interception for lifetime of program.
        .get("/user/repos?visibility=all")
        .reply(200, repoResponse);

    
        const repoNameTest = [];
		for( var i = 0; i < repoResponse.length; i++ ) {
				repoNameTest.push(repoResponse[i].name);
					//console.log(name);
			}

        await listRepos(msg).then(function(data) {
            expect(JSON.stringify(repo_names)).to.equal(JSON.stringify(repoNameTest));     
        })
    });



    

    //listIssues
   it("ensures that listIssues() returns true", async () => {

    msg = { "data": {
        "post": JSON.stringify({"message":"testrepo"}),
        "sender_name": "testuser" },
        "broadcast": { "channel_id": "abcd", }
  }
        
    var issueResponse = 
    [ { title: 'HW0-501', body: 'Operating Systems', id: '0101', number: '143343' },
    { title: 'BotTest', body: 'Bot Testing', id: '1234', number: '143342', },
    { title: 'HW0-510', body: 'Software Engineering', id: '0551', number: '134243', } ]

    var issueListTest = [];
    for(var i = 0; i < issueResponse.length; i++) { 
    issueListTest.push(issueResponse[i].title + ":\n" + issueResponse[i].body + "   ID: " + " " + issueResponse[i].id);
    }

    //MOCK SERVICE
    var listIssuesIntercept = nock("https://github.ncsu.edu/api/v3")
    //.persist() // This will persist mock interception for lifetime of program.
    .get("/repos/testuser/testrepo/issues?state=open")
    .reply(200, issueResponse);


    await listIssues(msg, 0).then(function(data) {
        expect(JSON.stringify(global_issues)).to.equal(JSON.stringify(issueListTest));     
    })
});


//closeIssueID
it("ensures that closeIssueID() returns true", async () => {

    msg = { "data": {
        "post": {"message":"testrepo"},
        "sender_name": "testuser" },
        "broadcast": { "channel_id": "abcd", }
  }
        
    var issueResponse = 
    [ { title: 'HW0-501', body: 'Operating Systems', id: '0101', number: '143343' },
    { title: 'BotTest', body: 'Bot Testing', id: '1234', number: '143342', },
    { title: 'HW0-510', body: 'Software Engineering', id: '0551', number: '134243', } ]

    //MOCK SERVICE
    var getIssuesForClosingIntercept = nock("https://github.ncsu.edu/api/v3")
    //.persist() // This will persist mock interception for lifetime of program.
    .get("/repos/testuser/testrepo/issues?state=open")
    .reply(200, issueResponse);

    //MOCK SERVICE
    var closIssuesIntercept = nock("https://github.ncsu.edu/api/v3")
    //.persist() // This will persist mock interception for lifetime of program.
    .intercept("/repos/testuser/testrepo/issues/143342", "patch")
    .reply(200, issueResponse);


    await closeIssueID(msg, "testrepo", "1234").then(function(data) {
        expect(JSON.stringify(closeStatus)).to.equal(JSON.stringify(200));     
    })
});


    //createIssueBody function
    it("ensures that createIssueBody() returns true", async () => {
        // CREATE TEST OBJECT
        msg = { "data": {
                  "post": JSON.stringify({"message":["CSC501", "CSC548", "CSC600"]}),
                  "sender_name": "TestUser" },
                "broadcast": { "channel_id": "abcd", }
            }

        var repoResponse = 
        [{ name: 'CSC-501', full_name: 'anaray23/CSC-501', },
        { name: 'BotTest',full_name: 'anaray23/BotTest', },
        { name: 'HW1-510', full_name: 'anaray23/HW1-510', }]
           
        //MOCK SERVICE
        var createIssueIntercept= nock("https://github.ncsu.edu/api/v3")
        //.persist() // This will persist mock interception for lifetime of program.
        //.get("/repos/TestUser/TestRepo/issues")
        .intercept("/repos/TestUser/TestRepo/issues", "post")
        .reply(200, repoResponse);

        
        await createIssueBody(msg, "TestIssue", "TestRepo").then(function(data) {
            expect(JSON.stringify(status_of_api)).to.equal(JSON.stringify(200));     
        })
    });



    
    //displayCreateIssue function
    it("ensures that displayCreateIssue() returns true", async () => {
        // CREATE TEST OBJECT
        msg = { "data": {
                  "post": {"message":["CSC501", "CSC548", "CSC600"]},
                  "sender_name": "testUser" },
                "broadcast": { "channel_id": "abcd", }
            }

        var repoResponse = 
        [{ name: 'CSC-501', full_name: 'anaray23/CSC-501', },
        { name: 'BotTest',full_name: 'anaray23/BotTest', },
        { name: 'HW1-510', full_name: 'anaray23/HW1-510', }]
           
        //MOCK SERVICE
        var listReposIntercept= nock("https://github.ncsu.edu/api/v3")
        //.persist() // This will persist mock interception for lifetime of program.
        .get("/user/repos?visibility=all")
        .reply(200, repoResponse);

       
        const repoNameTest = [];
		for( var i = 0; i < repoResponse.length; i++ ) {
				repoNameTest.push(repoResponse[i].name);
					//console.log(name);
			}

        await displayCreateIssue(msg).then(function(data) {
            expect(JSON.stringify(repo_names)).to.equal(JSON.stringify(repoNameTest));     
        })
    });






    //displayNextMsgForCreateIssue function
    it("ensures that displayNextMsgForCreateIssue() returns true", async () => {
        // CREATE TEST OBJECT
        msg = { "data": {
                  "post": JSON.stringify({"message":["CSC501", "CSC548", "CSC600"]}),
                  "sender_name": "testUser" },
                "broadcast": { "channel_id": "abcd", }
            }

        let repoNameTest = JSON.parse(msg.data.post);

        await displayNextMsgForCreateIssue(msg).then(function(data) {
            expect(JSON.stringify(repo_name_for_create_issue)).to.equal(JSON.stringify(repoNameTest.message));     
        })
    });



    //displayThirdMsgForCreateIssue function
    it("ensures that displayThirdMsgForCreateIssue() returns true", async () => {
        // CREATE TEST OBJECT
        msg = { "data": {
                  "post": JSON.stringify({"message":["CSC501", "CSC548", "CSC600"]}),
                  "sender_name": "testUser" },
                "broadcast": { "channel_id": "abcd", }
            }

        let repoNameTest = JSON.parse(msg.data.post);

        await displayThirdMsgForCreateIssue(msg).then(function(data) {
            expect(JSON.stringify(issue_title)).to.equal(JSON.stringify(repoNameTest.message));     
        })
    });

    it("ensures that displayCreateReminderMessage() returns 1", async () => {
        
        // CREATE TEST OBJECT
        msg = { "data": {
            "post": {"message":["CSC501", "CSC548", "CSC600"]},
            "sender_name": "testUser" },
            "broadcast": { "channel_id": "abcd", }
        }

        await displayCreateReminderMessage(msg).then(function(data) {
            expect(JSON.stringify(data)).to.equal(JSON.stringify(1)); 
        })

    });

    //checkUserInDB function
    it("ensures that checkUserInDB() returns true", async () => {
      
        var userResponse = 
        { login: "testUser" }

 
        //MOCK SERVICE
        var getUserIntercept = nock("https://github.ncsu.edu/api/v3")
        //.persist() // This will persist mock interception for lifetime of program.
        .get("/user")
        .reply(200, userResponse);

        //MOCK SERVICE
        var firebaseIntercept = nock("https://fir-test-4c03b-default-rtdb.firebaseio.com")
        //.persist() // This will persist mock interception for lifetime of program.
        .get("/")
        //.intercept("/repos/TestUser/TestRepo/issues", "post")
        .reply(200, userResponse);



        await checkUserInDB().then(function(data) {
            expect(JSON.stringify(userID)).to.equal(JSON.stringify(userResponse.login)); 
            //expect(JSON.stringify(userID)).to.equal(JSON.stringify(1));         
        })
    });




    //showTodo function
    /*it("ensures that showTodo() returns true", async () => {
      
        // CREATE TEST OBJECT
        msg = { "data": {
            "post": JSON.stringify({"message":["CSC501", "CSC548", "CSC600"]}),
            "sender_name": "testUser" },
            "broadcast": { "channel_id": "abcd", }
        }

        var userResponse = 
        {"issues":{"0":"issueTest"},"reminders":{"0":"remindersTest"},"todo_list":{"0":"fakeTODO"}}
 
        //MOCK SERVICE
        var firebaseIntercept = nock("https://fir-test-4c03b-default-rtdb.firebaseio.com")
        //.persist() // This will persist mock interception for lifetime of program.
        .get("/")
        //.intercept("/repos/TestUser/TestRepo/issues", "post")
        .reply(200, userResponse);



        await showTodo(msg).then(function(data) {
            expect(JSON.stringify(temp_todo_list)).to.equal(JSON.stringify(1)); 
            //expect(JSON.stringify(userID)).to.equal(JSON.stringify(1));         
        })
    });*/




     
     //exit process
     it("used for exit", function() {
     process.exit(1);  
    });
      

});

            
                /*
                 const fs = require('fs')
                //test
               
                const jsonString = JSON.stringify(repo_names)
        
                fs.writeFile('./newCustomer.json', jsonString, err => {
                if (err) {
                console.log('Error writing file', err)
                } else {
                console.log('Successfully wrote file')
                }
                })
                //testend
                */



                //listRepos(msg);
        
        //returnValue = bot.hearsForRepoName(msg, "BotTest");
        //console.log(returnValue);

        /*var result = [];
        for( var i = 0, n = repoResponse.length;  i < n;  ++i ) {
        var o = repoResponse[i].name;
        result[i] = { o};
        }
        //test
    
        const jsonString = JSON.stringify(result)
    
        fs.writeFile('./newCustomer.json', jsonString, err => {
        if (err) {
        console.log('Error writing file', err)
        } else {
        console.log('Successfully wrote file')
        }
        })
        //testend
        */

        /*
        function enableRequestLogger() {
    
            const original = https.request
            https.request = function(options, callback){
              console.log(`${new Date().toISOString()} ${options.method} ${options.protocol}//${options.hostname}${options.path}`);
              return original(options, callback);
            }
        }
        enableRequestLogger();
        */
