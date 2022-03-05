
# Weather Bot

We will write a simple bot that runs on your local machine, Listens to a chat server (Mattermost), and get's the current weather whenever you say the word "weather", as in "How's the weather right now?"

## Open Weather API

We will use [OpenWeatherAPI.org](https://openweathermap.org/appid) for weather info. 

1. Register your email in order to retrieve an OpenWeatherAPI.org token.
2. Save your token somewhere you can find it (since you can probably only view it once.)  If you need to, you can alwasy create a new "open weather api" token.

## Mattermost Chat Server

We have already created a Mattermost account for you at [https://chat.robotcodelab.com](https://chat.robotcodelab.com).   Your credentials are:

* username: `YOUR-UNITY-ID@ncsu.edu`
* password: `[YOUR-UNITY-ID][Last-4-of-student-id]!CSC510`

I recommend you change your password after login and save your password somewhere safe.

After you login, you should see a channel with your `unity-id` and on this channel there should be a message from `dr_ore` __with your MatterMost Personal Access Token__.  You will need this token to authentical your bot with the MatterMost server.

* [ ] Change to your personal channel (the one with your `unity-id`).  Use __only this channel__ for testing (not the "Town Square").   



### Prereq

Install code.

```bash
git clone https://github.ncsu.edu/CSC-510/WeatherBot
cd WeatherBot
npm install
```

Set up tokens. You do not want to store sensitive information like api tokens in public locations. Instead, you can store these in configuration files or environment variables.
   
In windows, you can run:
```
setx OPENWEATHERTOKEN "<YOUR-OPENWEATHER-TOKEN>"
setx BOTTOKEN "<YOUR-MATTERMOST-PERSONAL-ACCESS-TOKEN>"
# You will then need to close the cmd window and reopen.
```
In other systems, you can set them in your shell, like in `.bash_profile`:
```
# Edit .bash_profile to have:
export OPENWEATHERTOKEN="<YOUR-OPENWEATHER-TOKEN>"
export BOTTOKEN="<YOUR-MATTERMOST-PERSONAL-ACCESS-TOKEN>"
# Then reload
$ source ~/.bash_profile
```

## Getting the weather

Lets' make a call to the weather API. See the code inside `weather.js.`

If you want to customize the weather information your bot returns, you can see all the [OpenWeatherMap.org API options (Forecast, Solar Radiation, etc)](https://openweathermap.org/api).

Notice in the code below (`weather.js`) you can change the units to metric.  This code returns ("resolves") something called a [Javascript Promise (link for more details)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).   A Promise is a kind of object that handles an asynchronous transaction.   When we return a Promise, the caller can check the status (_"pending", "fulfilled", "rejected"_) and will be able to use data from the Promise when the Promise has completed.  In this case, the Promise is kind of like a placeholder for the response we get from a REST API call.

```javascript
function getWeather()
{
    var latitude = "35.794238297241435"
    var longitude = "-78.69940445049596"
    var units = "imperial"   // Alternatives:   "metric"
    let options = getDefaultOptions(`/weather?lat=${latitude}&lon=${longitude}&units=${units}`, "GET");

    return new Promise(function(resolve,reject)
    {
		axios(options)
			.then(function (response) {
                data = response.data
                var w = data.weather[0].description + " and feels like " + data.main.feels_like;
                resolve(w);
			})
			.catch(function (error) {
				console.log(chalk.red(error));
				reject(error);
				return; // Terminate execution.
            });
    });
}
```

Uncomment the following code.

```javascript
// (async () => {
//     let w = await getWeather();
//     console.log(w);
// })();
```

You can run `node weather.js` and confirm you can properly retrieve the weather information.

## Understanding Bots in Mattermost

A common way to build a "responder bot" is to use a "hears/process/send" pattern.

```javascript
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
        if( hears(msg, "weather") )
        {
            parseMessage(msg.data.post);
        }
    });
}
```

This code will subscribe to events published by mattermost via a connected websocket. Whenever a 'message' event is received, a callback is called. The message is checked for a pattern, and then processed. The bot can respond to the channel.

## Testing your bot.

(FYI: In this workshop example, your bot account is the same as your user account.)

Run `node index.js`. You should be able to verify you can connect to mattermost. Your account should reply to any message that contains information about the weather.

![](img/weatherbot.png)

## Enhance or Extend your bot.  Be creative!

See if you can extend the bot to be able to get the current location as part of a conversation.

Use the [OpenWeatherMap.org API options (Forecast, Solar Radiation, etc)](https://openweathermap.org/api) to respond to different words, or get a picture.

See if you can extend the bot to be able to respond to differen twords, or also work with a Slack server.

Examine the [MatterMost API](https://api.mattermost.com/) and see if you can interact with other aspects of the MatterMost server, like posting pictures or adding reactions.  

