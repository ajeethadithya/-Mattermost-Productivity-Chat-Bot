## Deployment Scripts

### Instructions to Run Ansible Playbook (deploy.yml)

* The user should login to VCL using their NCSU credentials.
* Move to the respective repository within the Team 24 VCL instance using the following command: **cd /home/anaray23/ansible-files**
* Once the directory location has changed, run the deployment scripts using the following command: **sudo ansible-playbook deploy.yml --extra-vars @secrets.yml --ask-vault-pass**

### Screencast

Link to the screencast:  

## Acceptance Testing

### Instructions to the User for any Github related functionality

#### 1. Testing already Deployed Bot (Uses GitHub Personal Access Token of one of the Team Members)
* The focus bot deployed on VCL uses one of our team member's GitHub PAT to clone using Ansible Playbook and perform any GitHub related use cases/commands  
* We have created a Test Repository called DEPLOY_TEST_REPO and have added the TAs as collaborators.
* When tests are performed on Mattermost on the deployed code the TAs will be able to access the Team Member's personal repositories including the DEPLOY_TEST_REPO.
* Any GitHub related uses cases (create issue, close issue, show issues) can be performed on this repository and since the TAs are added as collaborators, the TAs will be able to see the change being reflected through their account.
* Please use the above repository for any sort of testing

#### 2. Testing Bot Using TAs PAT (Requires the PAT to be changed in the Ansible Vault that's present in the server)
To use the TAs Personal Access Token, the TAs will have to perform the following actions and re-deploy the bot as follows:
* Create Personal Access Tokens on Github (if there isn't one for your account already- Please see the end of page for further instructions on how to create PAT)
* In our server, stop the already deployed code using the following command: **sudo pm2 stop 0**
* Change directory to access the Ansible-Vault using the following command: **cd /home/anaray23/ansible-files**
* Run the following command to decrypt the secrets.yml file: **sudo ansible-vault decrypt secrets.yml**
* User will be prompted to enter a passcode that has been submitted via the Google Form by Team-24
* Kindly replace the existing GitHub PAT with your GitHub PAT and not modify anything else
* Run the following command to encrypt the file again using the following command: **sudo ansible-vault encrypt secrets.yml**
* User will be prompted twice to set a new passcode. (User can set the same passcode set during decryption)  
* Run the playbook as follows: **sudo ansible-playbook deploy.yml --extra-vars @secrets.yml --ask-vault-pass**

**P.S: GitHub related functionalities are aimed at increasing personal productivity and hence is designed to access only repositories created/owned by the user. Hence, the TA will be able to view all their repositories however can only access the repositories that are owned by them. If the TAs prefer testing through their PAT, kindly create a Test Respository of your choice and use that to perform any sort of testing**

### Instructions to test the Bot

Use the following link to access the Focus Bot on the Mattermost Channel (Team-24) 

   https://chat.robotcodelab.com/csc510-s22/channels/team-24

On Team-24's Channel, the bot will display the following message when it is run for the first time/ code restarts on server.:

![Initial message](https://media.github.ncsu.edu/user/22704/files/37e9cf93-d1cd-483a-bb6c-18ca0be941b3)

You can start the conversation by typing "*hi*" or "*Hi*" or "*hello*" and you should expect the following message from the Focus Bot.

"Good to see you here! Hocus Pocus - Let's help you Focus."

Type "*help*" to learn the list of tasks that the bot can perform and the commands that you can use for the same.

Note: The commands you type are case-sensitive. For example, if you type *Help* instead of *help*, the bot will reply saying: "I can only understand a few commands! After all I am a bot! Please type help for a list of valid commands."

![Help_Command_Screenshot](https://media.github.ncsu.edu/user/22704/files/f6b9b53c-ab8f-4ca8-9211-179aceb321c2)


For easier evalutaion, we will type the commands pertaining to each Use-Case.

### Use-Case 1 : Personal To-Do List

Commands part of this use case:
1. *add todo*
2. *show todo*
3. *remove todo*

#### Add and Show To-Do List

User Input: *add todo*

Bot Reply: Enter the task to be added!

User: {Enter your task to add} eg. Remind me to submit SE project proposal

Bot Reply: Task added!

User Input: *add todo*

Bot Reply: Enter the task to be added!

User Input: {Enter task to add} eg. Review Pull Request #41

Bot Reply: Task added!

User Input: *show todo*

Bot Reply: 
1. Remind me to submit SE project proposal
2. Review Pull Request #41
                                 
#### Remove Tasks from your To-Do List

User Input: *remove todo*

The bot returns your personal To-Do List and asks you the task number to remove.

Bot Reply: 
1. Remind me to submit SE project proposal
2. Review Pull Request #41  
Enter the task number that you want to remove:
      
User Input: {Enter task number} eg. 1

Bot Reply: Task 1 successfully removed!

Now to check if the task has been removed, type "*show todo*" to see the reflected changes.


### Use-Case 2 : Github Issues
 
Commands part of this use case:
1. *create issue*
2. *show issues*
3. *close issue*
 
*NOTE: While displaying and closing issues, wait for a couple of seconds (depending on the Github server) for the changes to be reflected before checking the flow of instructions. You could also try refreshing the Github page for the changes to be updated.*
 
 
#### Create Issues

To create an issue in a Github repo that you own, type "*create issue*". The bot replies with the list of all repos in your account and asks you to specify the repo name.

Note: You can only create or remove issues in a repo that you own. Currently the BOT has been deployed using one of the team member's Github PAT. Use repository DEPLOY_TEST_REPO to view, create and close issues (TA's are added as collaborators and changes can be viewed using their account)

User Input: *create issue*

Bot Reply:

Enter a repo to create an issue from the list below: 

[repo_name_1, repo_name_2, repo_name_3, .....]

User Input: {Enter repo name} eg. DEPLOY_TEST_REPO 

Bot Reply: Enter the Title of the issue

User Input: {Enter title} eg. Bug Fixes in index.js

Bot Reply: Enter the body of the issue

User Input: {Enter Body} eg. Missing brackets and paranthesis.

Bot Reply: Issue has been created!


#### Show Issues

The bot returns the issues created in a particular repository along with their ID's.

User Input: *show issues*

Bot Reply: Enter the repo name for which you want to execute the command:

[repo_name_1, repo_name_2, repo_name_3, .....]

User Input: {Enter repo name} eg. DEPLOY_TEST_REPO

Bot Reply: 

eg. Title: Bug Fixes in index.js

Missing brackets and paranthesis

ID: 163030

#### Close Issue

You can close a Github issue of a particular repo by specifyig the issue ID

User Input: *close issue*

Bot Reply: Enter the repo name for which you want to execute the command:

[repo_name_1, repo_name_2, repo_name_3, .....]

User Input: {Enter repo name} eg. DEPLOY_TEST_REPO

Bot Reply: 

eg. Title: Bug Fixes in index.js

Missing brackets and paranthesis

ID: 163030

Enter the Issue ID of the issue that you want to close

User Input: {Enter issue ID} eg. 163030

Bot Reply: Issue has been successfully closed!

Now to check if the issue has been closed, type "*show issues*" or check your Github repo to see the reflected changes.


### Use-Case 3 : Reminders

Commands part of this use case:
1. *create reminder*
2. *show reminders*
3. *remove reminder*

#### Create Reminder

User Input: *create reminder*

Bot Reply: Enter reminder:

User Input: {Enter reminder} eg. update worksheet.md

Bot Reply: When shall I remind you? Enter date and time-24 hour format (FORMAT: YYYY-MM-DD hh:mm)

User input: {Enter date and time} eg. 2022-04-30 17:35

Bot Reply: Reminder Created!

During the specified date and time, a reminder will pop-up as follows (On the channel you created):

Bot Reply:

eg. REMINDER ALERT:

update worksheet.md
   
#### Show Reminders

The bot returns the reminders created along with the date and time for which it's created.

User Input: *show reminders*

Bot Reply: 

eg. 

1.update worksheet.md

 2022-04-30 17:35
 
#### Remove Reminder

User Input: *remove reminder*

Bot Reply: 

eg.

1.update worksheet.md

 2022-04-30 17:35
 
 Enter the reminder number that you want to remove:
 
User Input: {Enter reminder number} eg. 1
 
Bot Reply: Reminder 1 successfully removed!
 
 

### Use-Case 4 : Scheduling a Meeting

Commands part of this use case:
1. *create meeting*
2. *show meetings*

#### Schedule a Meeting

User can schedule a meeting by specifying the duration (name, start date and time, end date and time)

User Input: *create meeting*

Bot Reply: Enter Name of event:

User Input: {Enter event name} eg. Meeting with Team 24

Bot Reply: Enter Start date of event: Use the format YYYY-MM-DD.

User Input: {Enter date} eg. 2022-04-15

Bot Reply: Enter Start time of event: Use the format HH:MM

User Input: {Enter time} eg. 07:35

Bot Reply: Enter End date of event: Use the format YYYY-MM-DD.

User Input: {Enter date} eg. 2022-04-16

Bot Reply: Enter End time of event: Use the format HH:MM.

User Input: {Enter time} eg. 04:45

Bot Reply: Enter a brief description of event: 

User Input: {Enter desc} eg. Discussion of deployment phase

Bot Reply: Meeting/Event has been created in your calendar! Enter *show meetings* to display scheduled meetings 

All the created meetings can be viewed on the Google Calendar. 

The link to the calendar:  https://calendar.google.com/calendar/u/2?cid=MDdkYmZmcTdlNTQ4c21icXMzN2Jrb3J1NzBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ

#### View Meetings

User can view the list of meetings on a specific date and within a time frame in the calendar. 

User Input: *show meetings*

Bot Reply: Enter Start date of event: Use the format YYYY-MM-DD

User Input: {Enter date} eg. 2022-04-15

Bot Reply: Enter Start time of event: HH:MM

User Input: {Enter time} eg. 07:35

Bot Reply: Enter End date of event: Use the format YYYY-MM-DD

User Input: {Enter date} eg. 2022-04-16

Bot Reply: Enter End time of event: Use the format HH:MM

User Input: {Enter time} eg. 04:45

Bot Reply: eg. → Meeting Name: Meeting with Team 24

To verify, use the link to the calendar:  https://calendar.google.com/calendar/u/2?cid=MDdkYmZmcTdlNTQ4c21icXMzN2Jrb3J1NzBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ


### Use-Case 5 : Automatic Reminders for Github Issues

Automatic reminders are set for Github issues that are newly created. Ideally, reminders are displayed 3 days after issue has been created but for testing purpose, it will be displayed after a minute (on Team 24's Channel).

eg. 

ISSUE REMINDER ALERT:

  Bug Fixes on index.js:
  
  DEPLOY_TEST_REPO       ID: 163030
  
Note: If the Github issue is closed before the reminder is displayed, the reminder itself gets deleted. 

## Exploratory Testing and Code Inspection

Edge cases and errors are handled to the best of our knowledge. They could be tested using the examples provided for each use case below. Additionaly, you can try your own input to interact with the bot and stay productive!  

#### Error Handling for Use Case 1: Personal To-Do List.

1. Entering an invalid task number/ gibberish while trying to remove from the list

   => Bot Reply: "Please enter a number from the list shown above, try again from the beginning."

2. Typing "*show todo*" when you don't have taks in your todo list.

   => Bot Reply: "There is nothing to show"

#### Error Handling for Use Case 2: Github Issues

1. Entering a wrong repo name while executing either of the commands: *create issue*, *show issue*, *close issue*.

   => Bot Reply: "Repo name entered does not match with the ones given above, kindly start over."

2. Entering a wrong issue ID while trying to close an issue.

   => Bot Reply: "Please enter a valid Issue ID from the ones given above, kindly start over."

#### Error Handling for Use Case 3: Reminders
 
1. Entering show reminders when there are no active reminders.
 
   => Bot Reply: "You have no reminders"
 
2. Entering invalid time or date while creating a reminder.
 
   eg. 2022-08-19 40:40 (or) 2022-02-31 15:45 (or) 2022-02-27 15:45 (past date)
 
   => Bot reply: "Please enter a valid date and time following the format! Try again from the beginning."
 
3. Entering invalid reminder number/ gibberish while trying to remove a reminder.
 
   => Bot Reply: "Please enter a valid number, kindly start over."

#### Error Handling for Use Case 4: Scheduling a Meeting

1. Entering invalid date format.

   => eg. 2022-9-10  Bot Reply: Please check month format. Enter Month as MM, Try again or enter stop to terminate the process.

   => eg. 22-09-10   Bot Reply: Please check year format. Enter Year as YYYY, Try again or enter stop to terminate the process

   => eg. 2022-03-2  Bot Reply:  Please check day format. Enter Day as DD, Try again or enter stop to terminate the process!

2. Entering invalid time format.

   => eg. 2:35  Bot Reply: Please check 'hours' format. Enter hours as 'HH', Try again or enter stop to terminate the process.

   => eg. 05:5  Bot Reply: Please check 'minutes' format. Enter minutes as 'MM', Try again or enter stop to terminate the process

   => eg. 01:78 Bot Reply: Please enter a valid time following the format! Try again or enter stop to terminate the process

**Note** : For this use case, if invalid input is entered, the user is given multiple attempts to correct the input or can simply type *stop* to start over. 

User Input: *stop*

Bot Reply: Process has stopped. Enter *help* for available commands !!

## Additional Instructions
### Creating Personal Access Tokens on Github

Verify email address.
In the upper right corner, select settings → Developer Settings → Personal Access Tokens → Generate New Token → provide valid name, expiration date, and scope → Select Generate Token.

Use the following link for further reference: 

https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token


## Updated Worksheet 
Link to the Worksheet.md:   https://github.ncsu.edu/csc510-s2022/CSC510-24/blob/main/WORKSHEET.md 

## Final Code
Link to the final code: https://github.ncsu.edu/csc510-s2022/CSC510-24/tree/main/Bot
