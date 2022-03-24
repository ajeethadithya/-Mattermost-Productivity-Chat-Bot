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
import { hears, listRepos, repo_names } from '../index.js';
import {listAuthenicatedUserRepos, getIssues, getDefaultOptions, getUser } from '../toDoListBot.cjs';
import repo_name from "../toDoListBot.cjs";
//import { json } from "express/lib/response";


// Turn off logging
console.log = function(){};

describe("FocusBot Tests", function() {


    //MOCK SERVICE
   /*var mockService = nock("https://github.ncsu.edu/api/v3")
      //.log(console.log)
     .persist() // This will persist mock interception for lifetime of program.
     .get("/user/repos?visibility=all")
     .reply(200, JSON.stringify(data.msg.data.post.message))*/

     // CREATE TEST OBJECT
    let msg = {"data": {"sender_name": "test",
               "post": JSON.stringify({"message": "BotTest"})},
                "broadcast": {
                "omit_users": null,
                "user_id": "",
                "channel_id": "rtgh7k4q9fg9tmtpnzb8cp4pze", //sptfq15q83d5iexq9fygye18pc
                "team_id": "" 
                }};



    this.timeout(5000);
    it("ensures that hears() returns false on empty input", function() {
        console.log("hello");
        // CREATE TEST OBJECT
        msg = {"data": {"sender_name": ""}};
        let returnValue = hears(msg, "")
        assert(returnValue === false);
    });

    //hears function
    it("ensures that hears() returns true", function() {
        // CREATE TEST OBJECT
        console.log("hello");
        msg = {"data": {"sender_name": "test",
               "post": JSON.stringify({"message": "show issues"})}};
        let returnValue = hears(msg, "show issues")
        assert(returnValue === true);
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


    //listAuthenicatedUserRepos
   it("ensures that listAuthenicatedUserRepos() returns true", function() {

        var repoResponse = 
            [
            {
            name: 'HW0-510',
            full_name: 'anaray23/HW0-510',
            },
            {
            name: 'BotTest',
            full_name: 'anaray23/BotTest',
            },
            {
            name: 'HW1-510',
            full_name: 'anaray23/HW1-510',
            }
            ]
        
    
        //MOCK SERVICE
        var listReposIntercept= nock("https://github.ncsu.edu/api/v3")
        .persist() // This will persist mock interception for lifetime of program.
        .get("/user/repos?visibility=all")
        .reply(200, repoResponse);


        listAuthenicatedUserRepos();
    
        //var mockedData = fs.readFileSync('./newCustomer.json');
        var recvData = fs.readFileSync('./mock1.json');

        const obj = JSON.parse(recvData);
        const myJSON = JSON.stringify(repoResponse);
        
          
        //assert(mockedData.toString() === recvData.toString());
        //assert.equal(repo_names, result);
        assert.equal(myJSON, recvData);
    });


    //listIssues
   it("ensures that listIssues() returns true", function() {

        var issueResponse = 
        [
        {
        issuename: 'HW0-510',
        },
        {
        issuename: 'BotTest',
        },
        {
        issuename: 'HW1-510',
        }
        ]

        //MOCK SERVICE
        var getIssuesIntercept = nock("https://github.ncsu.edu/api/v3")
        .persist() // This will persist mock interception for lifetime of program.
        .get("/repos/testowner/testrepo/issues?state=open")
        .reply(200, issueResponse);

        getIssues("testowner", "testrepo");

        //var mockedData = fs.readFileSync('./newCustomer.json');
        var recvData = fs.readFileSync('./mock2.json');

        const obj = JSON.parse(recvData);
        const myJSON1 = JSON.stringify(issueResponse);

        assert.equal(myJSON1, recvData);
    });

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
        })*/
        //testend