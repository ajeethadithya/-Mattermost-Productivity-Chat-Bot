var chai   = require('chai');
var assert = chai.assert,
    expect = chai.expect;

const nock = require("nock");

// Load mock data
const data = require("../mock.json")

process.env.NODE_ENV = 'test'
var bot = require('../index');

// Turn off logging
console.log = function(){};

describe("FocusBot Tests", function() {


    //MOCK SERVICE
   var mockService = nock("https://github.ncsu.edu/api/v3")
      //.log(console.log)
     .persist() // This will persist mock interception for lifetime of program.
     .get("/user/repos?visibility=all")
     .reply(200, JSON.stringify(data.msg.data.post.message))


    this.timeout(5000);
    it("ensures that hears() returns false on empty input", function() {
        // CREATE TEST OBJECT
        msg = {"data": {"sender_name": ""}};
        let returnValue = bot.hears(msg, "")
        assert(returnValue === false);
    });

    //hears function
    it("ensures that hears() returns true", function() {
        // CREATE TEST OBJECT
        console.log("hello");
        msg = {"data": {"sender_name": "test",
               "post": JSON.stringify({"message": "show issues"})}};
        let returnValue = bot.hears(msg, "show issues")
        assert(returnValue === true);
    });


    //hearsForRepoName
    it("ensures that hearsForRepoName() returns true", function() {
        // CREATE TEST OBJECT
        msg = {"data": {"sender_name": "test",
               "post": JSON.stringify({"message": "CSC501"})},
                "broadcast": {
                "omit_users": null,
                "user_id": "",
                "channel_id": "sptfq15q83d5iexq9fygye18pc", //sptfq15q83d5iexq9fygye18pc
                "team_id": "" 
                }};
        
        let returnValue = toDoListBot.hearsForRepoName();
        assert(returnValue === true);
        
    });



    



});