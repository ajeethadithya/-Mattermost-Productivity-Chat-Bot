## Use Case Refinement:

#### Use Case 1: Issues Visualization

<b> Preconditions: </b>
- All users share a GitHub repository with assigned issues.
- All users have provided Github token access.

<b> Main Flow: </b>
- User requests issues information [S1] [Command: "Show Issues"]
- Bot returns the list of GitHub repositories available to the particular user [S2]
- Bot requests user to select repository to return the issues for [S3] 
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
- [S1] User enters a command to close issue [Command: close issues].
- [S2] Bot returns information regarding all available repositories. Request and await user input.
- [S3] User enters a command to select repository.
- [S4] Bot displays all the issues for the given user in the selected repository (Displays unique Issue ID that will be required to close the particular issue).
- [S5] User enters a command to select the issue and bot closes issue. Subsequently acknowledges successful closing.

<b> Alternative Flows: </b>
- [E1] No available issues for a given user.
- [E2] Entered Repository name doesn't exist.
- [E3] User has no available repositories.
- [E4] The Issue number doesn't exist.

#### Use Case 3: Periodic reminders/ Identifying overdue Github issues

<b> Preconditions: </b>
- Use case 1 (To-do list visualization has successfully returned pending tasks).

<b> Main Flow: </b>
- User requests addition of new reminders/ view existing reminders. [S1]
- The bot responds to user input. [S2]
- Bot checks overdue tasks and notifies users to perform action. [S3]
- User resolves the pending issue (or) proceeds to Use Case 3. [S4]

<b> Sub flows: </b>
- [S1] User enters a command to check available reminders/add new reminders [Command: show reminders].
- [S2] Bot adds new reminders/returns current reminder information.
- [S3] Bot identifies overdue tasks by comparing against a set threshold and notifies the user to perform the appropriate action [Logic: Current Date - Updated_at > set threshold].  
- [S4] User resolves task (or) requests assistance from collaborators (Use Case 3).

<b> Alternative Flows: </b>
- [E1] No available reminders.
- [E2] No overdue tasks.

#### Use Case 4: Scheduling a meeting with potentially available resources

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
