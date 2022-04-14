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


1.Initially, type "help" to check the list of valid commands and their usage instructions. Among the list, you can see that "add todo", "show todo" and "remove todo" commands are part of this use case.

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

 


  

