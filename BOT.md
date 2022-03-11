## Use Case Refinement:

#### Use Case 1: To-do list visualization

<b> Preconditions: </b>
- All users share a GitHub repository with assigned issues.
- All users have provided Github token access.

<b> Main Flow: </b>
- User requests to-do list information [S1] 
- Bot returns the list of GitHub issues assigned to the particular user [S2]
- User verifies tasks and may modify/add new tasks/close existing tasks (mark as completed) [S3].

<b> Sub flows: </b>
- [S1] User enters a command to check to-do list information.
- [S2] Bot returns information regarding tasks and awaits user operation. Request and await user input.
- [S3] User enters a command to add a new task(s)/mark existing tasks as completed.

<b> Alternative Flows: </b>
- [E1] No available tasks for a given user.

#### Use Case 2: Periodic reminders/ Identifying overdue Github issues

<b> Preconditions: </b>
- Use case 1 (To-do list visualization has successfully returned pending tasks).

<b> Main Flow: </b>
- User requests addition of new reminders/ view existing reminders. [S1]
- The bot responds to user input. [S2]
- Bot checks overdue tasks and notifies users to perform action. [S3]
- User resolves the pending issue (or) proceeds to Use Case 3. [S4]

<b> Sub flows: </b>
- [S1] User enters a command to check available reminders/add new reminders.
- [S2] Bot adds new reminders/returns current reminder information.
- [S3] Bot identifies overdue tasks by comparing against a set threshold and notifies the user to perform the appropriate action. 
- [S4] User resolves task (or) requests assistance from collaborators (Use Case 3).

<b> Alternative Flows: </b>
- [E1] No available reminders.
- [E2] No overdue tasks.

#### Use Case 3: Scheduling a meeting with potentially available resources

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
