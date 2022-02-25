# CSC 510- Focus Bot: P.A.M- Personal Accountability Manager

Team members
| Name      | Unity ID |
| ----------- | ----------- |
| Ajeeth Adithya Narayan    | anaray23     |
| Sriram Sudharsan   | ssudhar        |
|Smerithee Govindhen | sgovind5|
|Srivatsan Ramesh | srames22|


## Problem Statement:

 “Working at home features distractions and more than one in 10 millennials admitted being distracted by playing video games during the workday and one in five boomers did laundry during the workday.”

https://www.techrepublic.com/article/distractions-and-the-downsides-to-working-from-home/

We are aware that a company’s profitability is proportional to the overall productivity of different departments which in turn depends on the employee’s throughput. How to get the most and aid the employees to achieve their potential in every project? Automation with BOTs. In light of the current pandemic causing seismic disruptions to work culture and forcing employees around the globe to transition to a remote work environment, employees could do with a little help to create a pseudo work environment without having to carry out mundane and non-essential tasks. Working from home, despite sounding great for the first few weeks comes with numerous challenges- from virtual collaborations, employees losing track of time and goals to be achieved, and a variety of other distractions. The lack of in-person interaction and collaboration makes it difficult for higher authority to create a high-performing environment and hence lies on the individual to create a strong communication process and the team to build a self-organizing culture especially in the development and deployment phases of the software development life cycle

## Bot Description:

To facilitate this transition - a bot acting as a mini personal assistant with a primary objective to enhance productivity and provide the option to collaborate in crucial instances and subsequently, lead to the timely development and smooth software life cycle progress from an individual and team’s perspective.

- Our Focus Bot retrieves the GitHub issues assigned to the particular user in a shared repo and converts it into a To-Do List. 
- The bot provides a function to add user specific tasks to their To-Do list besides pulling the GitHub issues for each user. The user has the ability to view current tasks, mark tasks as completed, add and delete new tasks. 
- The bot enables the user to also close GitHub issues assigned to them on the shared repo. 
- The bot also has the ability to create reminders at regular intervals for the GitHub issues that are part of a user’s To-Do list. Users can also create custom reminders for user specific tasks. 
- The Focus Bot dynamically identifies overdue GitHub issues (eg.: unresolved issue for 3 days) on a user’s To-Do list, and reminds the user. 
- If a user is behind on his tasks to be completed, the bot generates a list of team members based on their availability to enable collaboration for overdue task completion. 
- Based on the selected team member, a request and then a meeting is also scheduled by the bot.


## *HOCUS POCUS, DON’T LOSE YOUR FOCUS*

## Use Cases:

<b>Use Case 1: To-do list visualization </b>

<b> Preconditions: </b>
- All users share a GitHub repository with assigned issues.
- All users have provided Github token access.

<b> Main Flow: </b>
- User requests to-do list information  
- Bot returns the list of GitHub issues assigned to the particular user 
- User verifies tasks and may modify/add new tasks/close existing tasks (mark as completed)[S3].

<b> Sub flows: </b>
- User enters a command to check to-do list information.
- Bot returns information regarding tasks and awaits user operation. Request and await user input.
- User enters a command to add a new task(s)/mark existing tasks as completed.

<b> Alternative Flows: </b>
- No available tasks for a given user.

<b> Use Case 2: Periodic reminders/ Identifying overdue Github issues </b>

<b> Preconditions: </b>
- Use case 1 (To-do list visualization has successfully returned pending tasks).

<b> Main Flow: </b>
- User requests addition of new reminders/ view existing reminders.
- The bot responds to user input. 
- Bot checks overdue tasks and notifies users to perform action. 
- User resolves the pending issue (or) proceeds to Use Case 3.

<b> Sub flows: </b>
- User enters a command to check available reminders/add new reminders.
- Bot adds new reminders/returns current reminder information.
- Bot identifies overdue tasks by comparing against a set threshold and notifies the user to perform the appropriate action. 
- User resolves task (or) requests assistance from collaborators (Use Case 3).

<b> Alternative Flows: </b>
- No available reminders.
- No overdue tasks.

<b> Use Case 3: Scheduling a meeting with potentially available resources </b>

<b> Preconditions: </b>
- All users have provided access to Google calendars.
- All users have Google Calendar API tokens.

<b> Main Flow: </b>
- User requests availability of other users. 
- Bot returns potential timeslots for peer-to-peer collaboration (schedule a meeting). 
- Request and await collaborator’s confirmation for meeting scheduling. 
- Schedule meetings and post links.

<b> Sub flows: </b>
- User enters a command to check other available user(s).
- Bot returns other available user(s). User selects potential collaborators.
- Bot requests the collaborator(s) for meeting approval.
- Bot schedules meetings and posts links.

<b> Alternative Flows: </b>
- No available time slots.
- All potential collaborators deny scheduling requests.

## Design Sketches:

### Wireframe Mockup:

<img width="550" src="https://media.github.ncsu.edu/user/23514/files/985546ad-3bcf-4380-bebc-397490cab9c7">


### Storyboard:

![Storyboard](https://media.github.ncsu.edu/user/23514/files/168f6875-29cf-44d1-9f16-d6506c235d78)

P.S: Kindly zoom-in to read the content.

## Architecture Design:
### Architecture Diagram

![Component](https://media.github.ncsu.edu/user/22704/files/e91222a1-7039-4727-a12e-4789eaa3cb14)

### Architecture Explanation
Usually, a software project is considered to have a variety of architecture styles combined to form a hybrid style. We have listed a few styles that would resemble the structure and implementation of our Focus bot to simplify the understanding of the workings of the bot with multiple diagrams as well.

Our bot resembles a basic repository style where there are several components whose computational processes are triggered by input requests and independently access the repository for any sort of data manipulation and fetching. Majority of the actions that our bot is designed to do, requires the usage of the user database. As any repository style consists of a client querying data, the user inputs from the Mattermost chat server are considered the client and the commands given by the user to view to-do list, view reminders, add tasks, add reminders among other actions will utilize the repository i.e., the user database.

We can consider our bot to also resemble an event-driven architectural paradigm where the program would wait for an event to occur (e.g.: a WebSocket event perhaps) and based on the event an action is triggered. Post the execution, the program comes back to a waiting state. Such an endless loop keeps happening over and over again and hence automation is achieved by the bot. In our case, our bot would receive an event from the Mattermost server and performs specific set of actions based on the content of the event and relays information back.

The following paragraphs explain the different components present in our software architecture for a simpler understanding of the Focus Bot.

1)	**Mattermost:** We decided to use Mattermost as it is an open-source chat server designed to essentially use in organizations for internal chat/communication and file sharing.  Our bot will be designed to listen to various channels for respective users on Mattermost using appropriate authentication and API calls for inputs to the server and the database. 

2)	**P.A.M:** The next component in the architecture is Focus bot itself called P.A.M- Personal Accountability Manager. We consider it to be a subsystem/component consisting of several other components. It consists of a Command Parser, Action Generator, Response Analyzer, Output Generator.

3) **Command Parser:**  As mentioned above, our Focus bot will be listening through appropriate ports to the user’s channel and waits for the input commands and instructions from the user to ease the user’s mundane tasks and increase productivity. The bot will have specific set of commands that we would configure to help with the tasks at hand. In order to identify if the set of commands are legal for further processing and to perform appropriate actions based on the commands, a parser checks the given input with a list of commands that the bot understands. If the command is legal, further execution of the program would take place.

4) **Action on Command:** We could think of this component to be methods/ procedures that are called based on the given legal input that comes from the command parser. For example, if the user gives the command ‘show to-do’ in the channel with P.A.M, the program control would go to the method that executes the actions required for the command. These actions include making API calls to the user database to fetch the user’s ‘To-Do List’ or updating the list dynamically by checking if the user has been assigned more ‘GitHub Issues’ by using relevant API calls.

5) **Response Analyzer:** This component can be considered as the part of software that formats the response appropriately and passes it to the output generator which is to be passed as a formal response of what was requested using the Mattermost API calls to the bot’s channel. This can be considered as an extension of the Action Component.

6) **Knowledge Base:** Coming out of the subsystem, our next component is the Knowledge Base which essentially contains the necessary real time data that we need to access using API calls in order to come up with the right response for P.A.M to give. This includes GitHub being the primary source for the ‘To-Do List’ from which we get user’s issues, Google Calendars from which we need the team member’s schedules, Reminder APIs that would trigger events based on time intervals.

7) **User Database:** This component is essential to the project as it would be set to contain all the data from user channel details, their input commands, each user’s To-Do list and even their reminders. Having a database is important to the project as it would maintain information about whether a user ‘Agree/Disagree’ to help/meet with another team member to solve pending issues for the team. We plan on using a NoSQL database like MongoDB to utilize the JSON format and to store the above-mentioned information for users and more as implementation progresses.

In a nutshell, all the above-mentioned components are a part of the server side i.e., our bot itself. It interacts with users in Mattermost which can be considered as the client. 

### Constraints and Guidelines

The project currently assumes that every participating user has previously installed and set up Mattermost. The Github OAUTH token required for access to Github accounts for each individual user must be configured for every user (ideally until the user is logged into their GitHub account). Each user’s necessary authentication tokens must be set as an environment variable. We also assume that every user has a pre-configured Google account to facilitate Google Calendar API creating and scheduling meetings. This would also require the user to provide the necessary permissions for the bot to access their respective Google Calendar. Taking into account the scope of work planned, the bot can respond to a pre-defined set of commands. Also, it is assumed that every user and a bot share one designated channel, implying a user’s respective bot might not be able to communicate with another user’s bot. This is because the application essentially runs on the respective user’s machine and not on a server.

### Additional Patterns and Designs

In general, a hybrid of designs can be attributed to a software project. The same holds for bot architecture and designs. There are plenty of designs that can be attributed to bots, not just in terms of software engineering designs, but different Bot Design Patterns. From our understanding, there are 6 types of bot design patterns:

1.	Notifiers
2.	Reactors
3.	Space Reactors
4.	Responders 
5.	Space Responders
6.	Conversationalists

We consider our Focus bot P.A.M to be a hybrid structure of the notifier, reactors, responders, space reactors and space responder patterns. We use the concept of ‘spaces’ as each channel for the user with the bot is considered to be the ‘space’ and based on each user’s data and requests in their space, the bot reacts and responds accordingly. P.A.M reacts to messages (predominantly commands) from the user and reacts with the output as a message. For example, if the user instructs P.A.M to ‘show to-do list’, then it reacts to the command and executes respective procedures and conditionals to fetch the data from the database and displays the list. Since, P.A.M has to fetch data for the user, it is considered to be a responder bot as it is aware of the user that is conversing with. Moreover, the bot is considered to have a Notifier Pattern since based on each user’s To-Do list, it sets reminders and notifies with a message regarding the due dates and over-due tasks from the To-Do list. However, it does not currently learn from what was said or remember the overall conversation and hence it does not abide by the conversationalist pattern. This could be a scope of future development for P.A.M. 

### Additional Diagrams 
For a better understanding of the implementation and flow of the software, use case diagrams, sequence diagram and a flowchart has been provided.


#### Flowchart 
<img src="https://github.ncsu.edu/csc510-s2022/CSC510-24/blob/ad1499f5d3ffae6756c878db8b1607db3e48aab4/Architecture/Flowchart.png" height="500" width="500">

#### Use Case Diagram

#### Sequence Diagram
<img src="https://github.ncsu.edu/csc510-s2022/CSC510-24/blob/ad1499f5d3ffae6756c878db8b1607db3e48aab4/Architecture/Sequence.png" height="500" width="500">




