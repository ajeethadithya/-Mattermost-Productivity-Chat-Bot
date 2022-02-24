# CSC 510- Focus Bot: P.A.M- Personal Accountability Manager

Team members
| Name      | Unity ID |
| ----------- | ----------- |
| Ajeeth Adithya Narayan    | anaray23     |
| Sriram Sudarshan   | ssudhar        |
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

Use Case 1: To-do list visualization 

Preconditions: 
- All users share a GitHub repository with assigned issues.
- All users have provided Github token access.

Main Flow: 
- User requests to-do list information  
- Bot returns the list of GitHub issues assigned to the particular user 
- User verifies tasks and may modify/add new tasks/close existing tasks (mark as completed)[S3].

Sub flows:
- User enters a command to check to-do list information.
- Bot returns information regarding tasks and awaits user operation. Request and await user input.
- User enters a command to add a new task(s)/mark existing tasks as completed.

Alternative Flows:
- No available tasks for a given user.

Use Case 2: Periodic reminders/ Identifying overdue Github issues

Preconditions: 
- Use case 1 (To-do list visualization has successfully returned pending tasks).

Main Flow: 
- User requests addition of new reminders/ view existing reminders.
- The bot responds to user input. 
- Bot checks overdue tasks and notifies users to perform action. 
- User resolves the pending issue (or) proceeds to Use Case 3.

Sub flows:
- User enters a command to check available reminders/add new reminders.
- Bot adds new reminders/returns current reminder information.
- Bot identifies overdue tasks by comparing against a set threshold and notifies the user to perform the appropriate action. 
- User resolves task (or) requests assistance from collaborators (Use Case 3).

Alternative Flows:
- No available reminders.
- No overdue tasks.

Use Case 3: Scheduling a meeting with potentially available resources

Preconditions: 
- All users have provided access to Google calendars.
- All users have Google Calendar API tokens.

Main Flow: 
- User requests availability of other users. 
- Bot returns potential timeslots for peer-to-peer collaboration (schedule a meeting). 
- Request and await collaborator’s confirmation for meeting scheduling. 
- Schedule meetings and post links.

Sub flows:
- User enters a command to check other available user(s).
- Bot returns other available user(s). User selects potential collaborators.
- Bot requests the collaborator(s) for meeting approval.
- Bot schedules meetings and posts links.

Alternative Flows:
- No available time slots.
- All potential collaborators deny scheduling requests.

## Design Sketches:

- Wireframe Mockup:

<img width="350" src="https://media.github.ncsu.edu/user/23514/files/985546ad-3bcf-4380-bebc-397490cab9c7">


- Storyboard:

![Storyboard](https://media.github.ncsu.edu/user/23514/files/168f6875-29cf-44d1-9f16-d6506c235d78)



