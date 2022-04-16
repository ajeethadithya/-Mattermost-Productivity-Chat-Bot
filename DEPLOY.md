## Deployment Scripts

## Acceptance Testing
### Instructions

Use the following link to access the Focus Bot on the Mattermost Channel (Team-24) 

    https://chat.robotcodelab.com/csc510-s22/channels/team-24

Once you go to the channel, the bot will display the following message:

"Hi there! I am PAM - your Personal Accountability Manager

Hocus Pocus - Let's focus!"

You can start the conversation by typing "hi" and you should expect the following message from the Focus Bot.

"Good to see you here! Hocus Pocus - Let's help you Focus."

Type "help" to learn the list of tasks that the bot can perform and the commands that you can use for the same.

Note: The commands you type are case-sensitive. For example, if you type Help instead of help, the bot will reply saying: "I can only understand a few commands! After all I am a bot! Please type help for a list of valid commands."

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

Initially, type "help" to check the list of valid commands and their usage instructions. Among the list, you can see that "create calendar" and "view calendar" commands are part of this use case.

#### Schedule a Meeting

User can schedule a meeting by specifying the duration (date and time)

i/p: create meeting

o/p: What is the event name?

i/p: scrum meeting

o/p: 

The event name is scrum meeting
What is the desc?

i/p: Discuss about configuration tools.

o/p:

The event desc is Discuss about configuration tools.
What is your start date? Please use the format YYYY-MM-DD

i/p: 2022-05-05

o/p:

Event start date is 2022-05-05
What is your start time? Pleae use the format HH:MM

i/p:  12:35

o/p:

Event start time is 12:35.
What is your end date? Please use the format YYYY-MM-DD

i/p:  2022-05-06

o/p:

Event end date is 2022-05-06
Event was successfully created.


#### View Calendar

User can view the list of events on a specific date and within a time frame in the calendar. 

i/p: show meetings

o/p: What is your start date? Please use the format YYYY-MM-DD

i/p: 2022-05-05

o/p:

Event start date is 2022-05-05
What is your start time? Pleae use the format HH:MM

i/p:  12:35

o/p:

Event start time is 12:35.
What is your end date? Please use the format YYYY-MM-DD

i/p:  2022-05-06

o/p:

Event end date is 2022-05-06



### Use-Case 5 : Automatic Reminders for Github Issues

Automatic reminders are created for github issues that are newly created. Ideally, reminders are displayed 3 days after issue has been created but for testing purpose, it will be displayed after a minute.

eg. 

ISSUE REMINDER ALERT:

  new issue:
  
  HW1-510       ID: 163030
  
Note: If the Github issue is closed before the reminder is displayed, the reminderitself gets deleted. 
 
