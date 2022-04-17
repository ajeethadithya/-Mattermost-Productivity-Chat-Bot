### Week 1

| Deliverable | Item/Status | Issues/Tasks |
| --- | --- | --- |
| **Use Case: Personal To-Do List** |  |   |
| Display To-Do List of the User (Show To-Do) | Completed with formatting | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/16 |
| User adds tasks to a List (Add To-Do)| Completed with formatting | Initial Dev: Storage in a global array. Sprint1: Database integration of tasks |
| Delete tasks specified by user from the To-Do List (Remove To-Do) | Completed with formatting | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/26 - The issues comments specify the tasks completed iteratively|
| Unit Tests | Complete | showtodo(), displayAddTodoMessage(), addTodo(), removeTodo()  |
| Error Handling/Edge Cases | Completed and Implemented on our MatterMost Channel | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/36 - Progress has been tracked and maintained in real-life (issue comments). Primary functions for error handling: main(), removeTodo() |


| Deliverable | Item/Status | Issues/Tasks |
| --- | --- | --- |
| **Use Case: GitHub Issues** |  |   |
| Display issues belonging to a particular repo of the user (Show Issues) | Completed with formatting | Initial Dev: Storage in a global array. Sprint1: Database integration of tasks |
| User adds issues to a specific repo (Add Issue)| Completed with formatting | Initial Dev: Storage in a global array. Sprint1: Database integration of tasks |
| Close issues specified by user from a specific repo (Close Issues) | Completed with formatting | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/15 |
| Unit Tests | Complete | listAuthenicatedUserRepos(), getIssues(), getUser(), listRepos(),.... |
| Error Handling/Edge Cases | Completed and Implemented on our MatterMost Channel | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/36 - Progress has been tracked and maintained in real-life (issue comments). Primary functions for error handling: main(), listRepos(), listIssues(), closeIssueID(), createIssueBody() |



| Deliverable | Item/Status | Issues/Tasks |
| --- | --- | --- |
| **Use Case: Reminders** |  |   |
| Display reminders for a user (Show Reminders) | Completed with formatting | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/18 - The issues comments specify the tasks completed iteratively. |
| User adds reminders (Create Reminders)| Completed with formatting | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/18 , https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/24 |
| Delete reminders specified by the user (Remove Reminders) | Completed with formatting | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/18 - The issues comments specify the tasks completed iteratively. |
| Unit Tests | Complete | displayCreateReminderMessage(), displayCreateReminderMessageTwo(), createReminder(), showReminders() |
| Error Handling/Edge Cases | Completed and Implemented on our MatterMost Channel | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/36 - Progress has been tracked and maintained in real-life (issue comments). Primary functions for error handling: main(), createReminder()[ Edge Case #39 ], removeReminders() |


### Week 2

| Deliverable | Item/Status | Issues/Tasks |
| --- | --- | --- |
| **Use Case: Scheduling a Meeting** |  |   |
| Create events on users calendar (Create Calendar Event) | Completed with formatting | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/27 |
| User retrieves the events in their calendar (Get Events)| Completed with formatting | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/43 |
| User removes events from their calendar (Delete Events) | Completed. Must test on Mattermost | Retrieve Event id for deletion |
| Unit Tests | In Progress | getEvents(), createcalEvent() |


| Deliverable | Item/Status | Issues/Tasks |
| ---   | --- | --- |
| **Use Case: Automatic Reminders for Github Issues** |  |   |
| Automatic reminders for github issues that are newly created. Ideally, Reminders are displayed 3 days after issue is created but for testing purpose it will be displayed after a minute. If the Github issue is closed before the reminder is displayed, the reminder itself gets deleted. (Issue Reminders) | Implementation has been completed and successfully tested on our MatterMost Channel | https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/41 - The issues comments specify the tasks completed iteratively. |



### Week 3 - Deployment Milestone

| Deliverable | ScrumBan Summary | Issues/Tasks | Item/Status |
| --- | --- | --- | --- |
| Initial Ansible Setup | Day 1: Discussion on which configuration tool to use for deployment and how to reuse the task done for HW3. | 1. Figuring out which configuration tool to use that are mentioned in the lecture. | Completed |
|  |  | 2. Understanding the services and packages required for our bot with suitable versions to create an environment |  |
| Server Setup using Ansible | Day 2: Discussion on setting up server connection and host file. | 1. Exploring host file options  -  decided to use localhost since we are deploying on server | Completed  |
|  |  | 2. Using scripts to install the required versions of node(16) [https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/64], community.npm.general, npm |  |
|  |  | 3. Tested server environment and cloning, forever package using WeatherBot workshop and Mattermost.|  |
| Ansible Scripts | Day 3: Splitting Ansible script tasks | 1. Cloning private CSC Team24 repo [https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/63] using Github username andd password authentication| Completed |
|  |  | 2. Installing npm, nodejs (version 16), forever packages |  |
|  |  | 3. Understanding and implementing forever package commands to deploy bot forever |  |
|  |  | 4. Repeated Task 1 using personal access tokens  |  |
| Extra Edge Case Handling of Use Cases apart from Sprint 1 and 2 | Day 4: Edge Case Discussion | 1. Entering invalid reminder number while trying to delete [https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/62] | Completed |
|  |  | 2. Handling the issue when trying to access empty repo on Github - listrepos() [https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/61] |  |
|  |  | 3. Entering invalid month format while trying to create a reminder [https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/60] |  |
|  |  | 4. Handling situations when Github server is down and list of repos can't be accessed - issueReminders() [https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/66] |  |
|  |  | 5. Proper Timezone for Calendar API in user input [https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/52] |  |
|  |  | 6. Handling date format for show meetings. [https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/48] |  |
|  |  | 7. Adding commands of UseCsse 4 in the "help" command [https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/67] |  |
| Acceptance Testing, Final Ansible Scripts and Code | Day 5: Structuring Acceptance Testing Instructions and discussing forever (npm package) issues caused when run through ansible but not through server command line. Day 6: Final merge and discussion about automation of environment variables setting. | 1. Documenting instructions on DEPLOY.md [https://github.ncsu.edu/csc510-s2022/CSC510-24/issues/65] | Completed  |
|  |  | 2. Testing final ansible scripts on our Mattermost channel after overnight deployment|  |
| Demo of Running Scripts and Final Documentation  | Day 7: Screencast | 1. Recording Screencast | Completed  |
|  |  | 2. Updating final worksheet |  |


