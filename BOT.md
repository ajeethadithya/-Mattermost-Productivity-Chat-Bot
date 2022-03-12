## Use Case Refinement:

#### Use Case 1: Issues Visualization

<b> Preconditions: </b>
- All users share a GitHub repository with assigned issues.
- All users have provided Github token access.

<b> Main Flow: </b>
- User requests issues information [S1].
- Bot returns the list of GitHub repositories available to the particular user [S2].
- Bot requests user to select repository to return the issues for [S3].
- Bot displays Issues in the selected repository [S4].

<b> Sub flows: </b>
- [S1] User enters a command to check issue information (Command: Show Issues).
- [S2] Bot returns information regarding all available repositories. Request and await user input.
- [S3] User enters a command to select repository.
- [S4] Bot displays all the issues for the given user in the selected repository returning (Issue Name, Issue Body and Unique Issue ID).

<b> Alternative Flows: </b>
- [E1] No available issues for a given user.
- [E2] Entered Repository name doesn't exist
- [E3] User has no available repositories


#### Use Case 2: Closing Issues

<b> Preconditions: </b>
- All users share a GitHub repository with assigned issues.
- All users have provided Github token access.

<b> Main Flow: </b>
- User requests to close issues [S1]
- Bot returns the list of GitHub repositories available to the particular user [S2]
- Bot requests user to select repository to return the issues for [S3] 
- Bot displays Issues in the selected repository and awaits user input (Issue ID that is requried to be closed).[S4]

<b> Sub flows: </b>
- [S1] User enters a command to close issue (Command: close issues).
- [S2] Bot returns information regarding all available repositories. Request and await user input.
- [S3] User enters a command to select repository.
- [S4] Bot displays all the issues for the given user in the selected repository (Displays unique Issue ID that will be required to close the particular issue).
- [S5] User enters a command to select the issue and bot closes issue. Subsequently acknowledges successful closing.

<b> Alternative Flows: </b>
- [E1] No available issues for a given user.
- [E2] Entered Repository name doesn't exist.
- [E3] User has no available repositories.
- [E4] The Issue number doesn't exist.





#### Use Case 3: Add To-do

<b> Preconditions: </b>
- User has access to the PAM Bot and Mattermost account.
- BOTTOKEN env has been set up previously.

<b> Main Flow: </b>
- User requests to add To-Do list information.[S1]
- Bot requests user to enter the task details (refer to pattern in Sub Flow (S2).[S2]
- User enters To-Do list details.[S3] 
- Bot acknowledges to-do list addition.[S4]

<b> Sub flows: </b>
- [S1] User enters a command to close issue (Command: "add todo").
- [S2] Bot returns message detailing information "Enter the task to be added with a hyphen before it (-task_one):". 
- [S3] User enters the task name in the appropriate format. (Command " - <task name> ") !Note the hyphen addition preceding task name!.
- [S4] Bot adds the todo list information and displays acknowledgement (Output: "Task Added").

<b> Alternative Flows: </b>
- [E1] User doesn't follow the pattern required.

 #### <b> Use Case 4: show todo list visualization. </b>

<b> Preconditions: </b>
- User has access to the PAM Bot and Mattermost account.
- BOTTOKEN env has been set up previously.

<b> Main Flow: </b>
- User requests todo list visualization. [S1]
- The bot responds to user input and Bot displays the todo list visualization. [S2]

<b> Sub flows: </b>
- [S1] User enters a command to check all reminders (Command: show todo).
- [S2] Bot displays user's todo list with todo list serial number.

<b> Alternative Flows: </b>
- [E1] No available todo tasks.
 
 

 #### <b> Use Case 5: Create Issues. </b>

<b> Preconditions: </b>
- User has access to the PAM Bot and Mattermost account.
- BOTTOKEN env has been set up previously.

<b> Main Flow: </b>
- User requests todo list visualization. [S1]
- The bot responds to user input and Bot displays the todo list visualization. [S2]

<b> Sub flows: </b>
- [S1] User enters a command to check all reminders (Command: show todo).
- [S2] Bot displays user's todo list with todo list serial number.

<b> Alternative Flows: </b>
- [E1] No available todo tasks.

 
 

#### Use Case 6: Creating a Google Calender Meeting

<b> Preconditions: </b>
 -All users have a Google service account.
- All users have provided access to Google calendars.
- All users have Google Calendar API tokens.
 -All users have provided their credential ID and OAUTH tokens.

<b> Main Flow: </b>
- [S1]
- Bot returns potential timeslots for peer-to-peer collaboration (schedule a meeting). [S2] 
- Request and await collaborator’s confirmation for meeting scheduling. [S3]
- Schedule meetings and post links. [S4]

<b> Sub flows: </b>
- [S1] User enters a command to check other available user(s).
- [S2] Bot returns other available user(s). User selects potential collaborators.
- [S3] Bot requests the collaborator(s) for meeting approval.
- [S4] Bot schedules meetings and posts links.

<b> Alternative Flows: </b>
- [E1] No available time slots.
- [E2] All potential collaborators deny scheduling requests.


 
 
 
#### Use Case 5: Scheduling a meeting with potentially available resources

<b> Preconditions: </b>
- All users have provided access to Google calendars.
- All users have Google Calendar API tokens.

<b> Main Flow: </b>
- User requests availability of other users. [S1]
- Bot returns potential timeslots for peer-to-peer collaboration (schedule a meeting). [S2] 
- Request and await collaborator’s confirmation for meeting scheduling. [S3]
- Schedule meetings and post links. [S4]

<b> Sub flows: </b>
- [S1] User enters a command to check other available user(s).
- [S2] Bot returns other available user(s). User selects potential collaborators.
- [S3] Bot requests the collaborator(s) for meeting approval.
- [S4] Bot schedules meetings and posts links.

<b> Alternative Flows: </b>
- [E1] No available time slots.
- [E2] All potential collaborators deny scheduling requests.



#### Use Case 5: Scheduling a meeting with potentially available resources

<b> Preconditions: </b>
- All users have provided access to Google calendars.
- All users have Google Calendar API tokens.

<b> Main Flow: </b>
- User requests availability of other users. [S1]
- Bot returns potential timeslots for peer-to-peer collaboration (schedule a meeting). [S2] 
- Request and await collaborator’s confirmation for meeting scheduling. [S3]
- Schedule meetings and post links. [S4]

<b> Sub flows: </b>
- [S1] User enters a command to check other available user(s).
- [S2] Bot returns other available user(s). User selects potential collaborators.
- [S3] Bot requests the collaborator(s) for meeting approval.
- [S4] Bot schedules meetings and posts links.

<b> Alternative Flows: </b>
- [E1] No available time slots.
- [E2] All potential collaborators deny scheduling requests.


Alternative 

#### Use Case 1: List Issues of a Specific Repository

<b> Preconditions: </b>
- All users share a GitHub repository with assigned issues.
- All users have provided Github token access.

<b> Main Flow: </b>
- User requests to display the Github issues. [S1] 
- Bot returns the list of Repos of that particular user [S2]
- User enters the repos name whose issues they want to be displayed [S3].
- Bot returns the list of issues along with their issue id for the specified repo name. [S4].

<b> Sub flows: </b>
- [S1] User enters the ‘Show Issues’ command to check the Github issues.
- [S2] Bot returns the repo names and awaits user operation. Request and await user input.
- [S3] User enters the repo name.
- [S4] Bot responds by displaying the issues.

<b> Alternative Flows: </b>
- [E1] No available repositories for a given user.
- [E2] No available issues in the specified repository.

#### Use Case 2: Close Issues from a Specific Repository

<b> Preconditions: </b>
- Use case 1 (List Issues of a Specific Repository has successfully returned the issues).

<b> Main Flow: </b>
- User requests to close issues. [S1]
- The bot returns the list of repositories of that user. [S2]
- The user enters the repository name from which they want to close issues. [S3]
- Bot displays the list of issues along with the issue id for the specified repo name. [S4]
- User enters the id of the issue that they want to close. [S5]
- Bot displays a message saying that the specified issue has been closed. [S6]

<b> Sub flows: </b>
- [S1] User enters the ‘Close issues’ command to close Github issues.
- [S2] Bot returns the repo names and awaits user operation. Request and await user input.
- [S3] User enters the repo name.
- [S4] Bot responds by displaying the issues along with their id. 
- [S5] User enters the issue id.
 - [S6] Bot responds by confirming that the issue has been closed.

<b> Alternative Flows: </b>
- [E1] No available repositories for a given user.
- [E2] No available issues in the specified repository.
