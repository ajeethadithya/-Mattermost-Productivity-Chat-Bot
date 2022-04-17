## Deployment Scripts
### Screencast

Link to the screencast:  

## Acceptance Testing
### Instructions

Use the following link to access the Focus Bot on the Mattermost Channel (Team-24) 

   https://chat.robotcodelab.com/csc510-s22/channels/team-24

Once you go to the channel, the bot will display the following message:

![Initial message](https://media.github.ncsu.edu/user/22704/files/37e9cf93-d1cd-483a-bb6c-18ca0be941b3)

You can start the conversation by typing "hi" or "Hi" or "hello" and you should expect the following message from the Focus Bot.

"Good to see you here! Hocus Pocus - Let's help you Focus."

Type "help" to learn the list of tasks that the bot can perform and the commands that you can use for the same.

Note: The commands you type are case-sensitive. For example, if you type Help instead of help, the bot will reply saying: "I can only understand a few commands! After all I am a bot! Please type help for a list of valid commands."

![Help_Command_Screenshot](https://media.github.ncsu.edu/user/22704/files/f6b9b53c-ab8f-4ca8-9211-179aceb321c2)


For easier evalutaion, we will type the commands pertaining to each Use-Case.

### Use-Case 1 : Personal To-Do List

Initially, type "help" to check the list of valid commands and their usage instructions. Among the list, you can see that "add todo", "show todo" and "remove todo" commands are part of this use case.

#### Add and Show To-Do List

i/p: add todo

o/p: Enter the task to be added

i/p: Create a new repo

o/p: Task added!

i/p: add todo

o/p: Enter the task to be added

i/p: Add colaborators

o/p: Task added!

i/p: show todo

o/p: 
1. Create a new repo
2. Add colaborators
                                 
#### Remove Tasks from your To-Do List

i/p: remove todo

The bot returns your To-Do List and asks you the specific task that you want to remove.

o/p: 
1. Create a new repo
2. Add colaborators      
Enter the task number that you want to remove.
      
i/p: 1

o/p: Task 1 successfully removed!

Now to check if the task has been removed, type "show todo"

o/p: 
1. add colaborators

#### Error Handling

1.Entering an invalid task number while trying to remove from the list

=> The bot replies saying, "Please enter a number from the list shown above, try again from the beginning."

2.Typing "show todo" when you haven't created a todo list.

=>

i/p: show todo

o/p: There is nothing to show

### Use-Case 2 : Github Issues
 
Initially type "help" to check the list of valid commands and their usage instructions. Among thme, you can see that "create issue", "show issues" and "close issue" are part of this use-case.
 
 NOTE: While displaying and closing issues, wait for a couple of seconds (depending on the Github server) for the changes to be reflected before checking the flow of instructions. 
 
 
#### Create Issues

To create an issue in a Github repo that you own, type "create issue". The bot replies with the list of all repos in your account and asks you to specify the repo name.

Note: You can only create or remove issues in a repo that you own.

o/p:

Enter a repo to create an issue from the list below:

Enter the repo name from which you want to execute the command:

[
"HW0-510"
"HW1-510"
"HW2-510"
"CSC510-24"
]

i/p: HW0-510

o/p: Enter the Title of the issue

i/p: new issue

o/p: Enter the body of the issue

i/p: create a new issue

o/p: Issue has been created!


#### Show Issues

The bot returns the issues created in a particular repository along with their ID's.

i/p: show issues

o/p:

Enter the repo name for which you want to execute the command:

[
"HW0-510"
"HW1-510"
"HW2-510"
"CSC510-24"
]

i/p: HW0-510

o/p: 

Title: new issue

Create a new issue

ID: 163030

#### Close Issue

You can close a Github issue of a particular repo by specifyig the issue ID

i/p: close issue

o/p:

Enter the repo name for which you want to execute the command:

[
"HW0-510"
"HW1-510"
"HW2-510"
"CSC510-24"
]

i/p: HW0-510

o/p: 

Title: new issue

Create a new issue

ID: 163030

Enter the Issue ID of the issue that you want to close

i/p: 163030

o/p: Issue has been successfully closed!

Now to check if the issue has been closed, type "show issues"

o/p:

Enter the repo name for which you want to execute the command:

[
"HW0-510"
"HW1-510"
"HW2-510"
"CSC510-24"
]

i/p: HW0-510

o/p: No issues in HW0-510

#### Error Handling

1.Entering a wrong repo name while executing either of the commands: create issue, show issue, close issue.

=> The bot replies:- "Repo name entered does not match with the ones given above, kindly start over."

2.Entering a wrong issue ID while trying to close an issue.

=> The bot replies:- "Please enter a valid Issue ID from the ones given above, kindly start over."

### Use-Case 3 : Reminders
 
Initially type "help" to check the list of valid commands and their usage instructions. Among thme, you can see that "create reminder", "show reminders" and "remove reminder" are part of this use-case.
 
#### Create Reminder

i/p: create reminder

o/p: Enter reminder

i/p: update worksheet.md

o/p: When shall I remind you? Enter date and time-24 hour format (FORMAT: YYYY-MM-DD hh:mm)

i/p: 2022-04-13 17:35

o/p: Reminder Created!

During the specified date and time, a reminder will pop-up as follows:

o/p:

REMINDER ALERT:

update worksheet.md
   
#### Show Reminders

The bot returns the reminders created along with the date and time for which it's created.

i/p: show reminders

o/p: 

1.update worksheet.md

 2022-04-13 17:35
 
#### Remove Reminder

i/p: remove reminder

o/p: 

1.update worksheet.md

 2022-04-13 17:35
 
 Enter the reminder number that you want to remove:
 
 i/p: 1
 
 o/p: Reminder 1 successfully removed!
 
 
 #### Error Handling
 
 1.Entering show reminders when there are no active reminders.
 
 => The bot replies:- "You have no reminders"
 
 2.Entering invalid time or date while creating a reminder.
 
 eg. 2022-08-19 40:40 (or) 2022-02-31 15:45 (or) 2022-02-27 15:45 (past date)
 
 => The bot replies:- "Please enter a valid date and time following the format! Try again from the beginning."
 
 3.Entering invalid reminder number while trying to remove a reminder.
 
 => The bot replies:- "Please enter a valid number, kindly start over."
 

### Use-Case 4 : Scheduling a Meeting

Initially, type "help" to check the list of valid commands and their usage instructions. Among the list, you can see that "create meeting" and "show meetings" commands are part of this use case.

#### Schedule a Meeting

User can schedule a meeting by specifying the duration (date and time)

i/p: create meeting

o/p: Enter Name of event.

i/p: scrum meeting

o/p: Enter Start date of event: Use the format YYYY-MM-DD.

i/p: 2022-04-15

o/p: Enter Start time of event: Use the format HH:MM

i/p: 07:35

o/p: Enter End date of event: Use the format YYYY-MM-DD.

i/p: 2022-04-16

o/p: Enter End time of event: Use the format HH:MM.

i/p:  04:45

o/p: Enter a brief description of event: 

i/p: Progress update on the worksheet towards the end of the milestone.

o/p: Meeting/Event has been created in your calendar! Enter show meetings to display scheduled meetings 

#### View Meetings

User can view the list of events on a specific date and within a time frame in the calendar. 

i/p: show meetings

o/p: Enter Start date of event: Use the format YYYY-MM-DD

i/p: 2022-04-15

o/p: Enter Start time of event: HH:MM

i/p: 07:35

o/p: Enter End date of event: Use the format YYYY-MM-DD

i/p: 2022-04-16

o/p: Enter End time of event: Use the format HH:MM

i/p: 04:45

o/p: → Meeting Name: scrum meeting

All the created meetings can be viewed on the Google Calendar as well. 

The link to the calendar:  https://calendar.google.com/calendar/u/2?cid=MDdkYmZmcTdlNTQ4c21icXMzN2Jrb3J1NzBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ

#### Error Handling

1.Entering invalid date format.

=> eg. 2022-9-10  The bot replies:- Please check month format. Enter Month as MM, Try again or enter stop to terminate the process.

=> eg. 22-09-10   The bot replies:- Please check year format. Enter Year as YYYY, Try again or enter stop to terminate the process

=> eg. 2022-03-2  The bot replies:  Please check day format. Enter Day as DD, Try again or enter stop to terminate the process!

2.Entering invalid time format.

=> eg. 2:35  The bot replies:- Please check 'hours' format. Enter hours as 'HH', Try again or enter stop to terminate the process.

=> eg. 05:5  The bot replies: Please check 'minutes' format. Enter minutes as 'MM', Try again or enter stop to terminate the process

=> eg. 01:78  The bot replies:- Please enter a valid time following the format! Try again or enter stop to terminate the process

i/p: stop

o/p: Process has stopped. Enter Help for available commands !!


### Use-Case 5 : Automatic Reminders for Github Issues

Initially, type "help" to check the list of valid commands and their usage instructions. Among the list, you can see that "Automatic Issue Github Reminders" command is part of this use case. 

Note:  This command need not be typed by the user. 

Automatic reminders are created for github issues that are newly created. Ideally, reminders are displayed 3 days after issue has been created but for testing purpose, it will be displayed after a minute.

eg. 

ISSUE REMINDER ALERT:

  new issue:
  
  HW1-510       ID: 163030
  
Note: If the Github issue is closed before the reminder is displayed, the reminder itself gets deleted. 


## Additional Instructions

### Creating Personal Access Tokens on Github

Verify email address.
In the upper right corner, select settings → Developer Settings → Personal Access Tokens → Generate New Token → provide valid name, expiration date, and scope → Select Generate Token.
In Ansible, enter the following command to access the Ansible-Vault.

ansible-vault decrypt secrets.yml

Enter the vault passcode shared in the Google Docs for Team-24

Once the environment variable is modified, enter the following command:

ansible-vault encrypt secrets.yml

ansible-playbook deploy.yml --extra-vars @secrets.yml --ask-vault-pass

Use the following link for further reference: 

https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
 
## Updated Worksheet 
Link to the Worksheet.md:   https://github.ncsu.edu/csc510-s2022/CSC510-24/blob/main/WORKSHEET.md 
