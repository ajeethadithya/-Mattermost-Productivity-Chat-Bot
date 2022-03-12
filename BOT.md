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
- User enters command. [S1]
- The bot responds to user input and Bot displays the repository. [S2]
-User enters the repository name. [S3]
-User is prompted to enter the issue. [S4]

<b> Sub flows: </b>
- [S1] User enters a command to create an issue (Command: create issue).
- [S2] Bot displays user's repo list.
- [S3] User enters with a "+" presceding the repo name.
 -[S4] User enters issue body with "++" precedig the body. Bot acknowledges the issue creation.

<b> Alternative Flows: </b>
- [E1] _Invalid repo name_.
 -[E2] - Incorrect syntax

 
 

#### Use Case 6: Displaying Google Calender Meetings

<b> Preconditions: </b>
 -All users have a Google service account.
- All users have provided access to Google calendars.
- All users have Google Calendar API tokens.
 -All users have provided their credential ID and OAUTH tokens.

<b> Main Flow: </b>
- User enters command to display his google calender details. [S1] 
- Bot inputs user's Google Credential ID.[S2]
- Displays all available meetings for the user int he given day [S3]

<b> Sub flows: </b>
- [S1] User enters a command to check meeting schedule(s) (Command: "show meetings").
- [S2] Bot inputs user's credential ID (in this case email address, eg. UNITYID@ncsu.edu).
- [S3] Bot displays all the available meeting schedules. 

<b> Alternative Flows: </b>
- [E1] No meetings scheduled for user.
- [E2] Incompatible timezones.

 
 
#### Use Case 7: Scheduling a meeting with potential resource.

<b> Preconditions: </b>
- All users have provided access to Google calendars.
- All users have Google Calendar API tokens.

<b> Main Flow: </b>
- User requests availability of other users. [S1]
- Bot returns potential timeslots for peer-to-peer collaboration (schedule a meeting). [S2] 
- Request and await collaborator’s confirmation for meeting scheduling. [S3]
- Schedule meetings and post links. [S4]

<b> Sub flows: </b>
- [S1] User enters a command to check other available user(s) (Command: "Check available users").
- [S2] Bot returns other available user(s). User selects potential collaborators. ("Enters collaborator's email address, in this case, ABC@ncsu.edu")
- [S3] Bot requests the collaborator(s) for meeting approval.
- [S4] Bot schedules meetings and posts links.

<b> Alternative Flows: </b>
- [E1] No available time slots.
- [E2] All potential collaborators deny scheduling requests.


 #### <b> Use Case 8: Remind issues </b>

<b> Preconditions: </b>
- User has access to the PAM Bot and Mattermost account.
- BOTTOKEN env has been set up previously.

<b> Main Flow: </b>
- User requests reminder. [S1]
- Bot returns overdue issues [S2]

<b> Sub flows: </b>
- [S1] User enters a command to check all reminders (Command: remind todo).
- [S2] Bot computes the overdue period (Using: CurrentDate - Issued_at > (set threshold)).
- [S3] Bot returns tasks overdue beyond the threshold limit.
 -[S4] Bot triggers the initialization of Use Case X

 <b> Alternative Flows: </b>
- [E1] No overdue issues.
 
 #### Changes from previous submission:
 
 - Use Case refinement - The feedback provided was taken into consideration and the following were modified. 
 
 -The command format is mentioned in detail to better facilitate understanding of syntax (eg.show meeting, -<task name>
 -Sequential flow is discussed in more detail to understand the workflow. 
 -Use Cases have been seperated into modular units to better represent their functionality.

 
 ScreenCast


Here is the link to our screencast: [Screencast for Bot Implementation](https://drive.google.com/file/d/15GZYqPbz0IFviM3cXxRbrFXh69wolDwK/view?usp=sharing)

