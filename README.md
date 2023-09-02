
Video challenge game project


Date:	28/10/2019


 
Table of Contents
1.	Initial unplatformed design framework	3
2.	Initial video chain game design prototype	4
3.	Technologies uses in implementation for the video game	5
4.	Project progress	6
5.	APPEDIX	7
1.	Prototype instruction	7

 
1.	Initial unplatformed design framework
Using social media platform, chatbot, server and domain to design the game (Figure 1). We can invite the players from facebook group to the game by using dialog flow chatbot, and assign the game link to all the player. The player can join the game by clicking the game link and wait for other players coming. After all players join the room and the game will start.
 
Figure 1.

 
2.	Initial video chain game design prototypes
Designing three prototypes of the video chain games in the following:
1.	The game plays in a single chain with all the players (Figure 1).
 
Figure 2.

2.	The game plays in a two chain with all the players with the same player in head of the chain, for example (Figure 2).
 
Figure 3.

3.	The game plays in random groups with eight players (Figure 3).
 
Figure 4.
 
3.	Technologies uses in implementation for the video game
We can use two ways to implement the game in following:
Case 1: Use existing talk.io website to build the chain video call game.
Basic algorithm for the chain game:
Create a sequence number as the room name
•	First player creates room Talky.io/1
•	Second player joins room Talky.io/1, and create a room Talky.io/2
•	Third player joins room Talky.io/2, and create a room Talky.io/3
•	Keep step above if the incoming players is in middle of the chain 
•	Game ready if the player joins the last room Talky.io/last in the tail of the chain. 
Implementing script on talky.io:
•	Write a script with those hyperlinks to create or join the room for all incoming player
•	The player should click on the join button in talky.io, and wait for all the players joining to start the game 

Case 2: Use javascript with WebRTC technology to build the chain video call game
Basic algorithm for the chain game:
	Game policy Javascript file
•	Define a Game with the rules 
	Video call room Javascript file
•	Random assigns the player’s location in the chain
•	Socket class creates 
•	Peer class creates
•	Using webWTC to connet the players in the room 
	Player information Javascript file
•	Player class creates
Chain information Javascript file
•	Chain class creates
	Run game Javasript file
•	Main script for the players playing the game 

We can use Case 1 first to explore the prototype design, and then optimise them by using case 2.
 
4.	Project progress
Finish the video chain game prototype 1.
Video chain game project	
WBS NUMBER	TASK TITLE	TASK OWNER	START DATE	DUE DATE	DURATION	PCT OF TASK COMPLETE
						
						
1	Prototype 1					
1.1	Framework design 	Wei	10/08/19	17/08/19	7	100%
1.2.	Application implementation  	Wei	17/08/19	24/08/19	7	100%
1.2.1	Define the game,
chain, player status	Wei	31/08/19	01/09/19	7	100%
1.2.2	Define the socket.io status	Wei	07/09/19	14/09/19	7	100%
1.3	Design interface	Wei	14/09/19	21/09/19	7	100%
1.4	Set up server and testing domain	Wei	21/09/19	27/09/19	7	100%
1.5	Utilise server and interface 	Wei	7/10/19	12/10/19	7	100%
1.6	Testing the game playing 	Wei	12/10/19	19/10/19	7	100%
1.7	Improve the game rules	Wei	19/10/19	26/10/19	7	100%
1.8	Testing the game playing	Wei	26/10/19	02/11/19	7	50
2	Prototype 2					
2.1		Wei	02/11/19	09/11/19	7	0%
2.2		Wei	09/11/19	16/11/19	7	0%
3	Prototype 3					
3.1		Wei	16/11/19	23/11/19	7	0%
3.2		Wei	23/11/19	29/11/19	7	0%
4	Dialog flow					
3.1		Wei			0	0%
3.2		Wei			0	0%

 
5.	APPEDIX
1.	Prototype 1 game Instruction
	Weblink: https://www.vcchallengegame.com/
•	Game setting:
1.	Only one chain in the game.
2.	Maximum number of players in one chain is 5.
3.	Maximum ready time for the player is 30 seconds.
•	Start the game:
1.	A player joins the game
1.	Enter the weblink above. 
2.	The player is assigned in first available position of the chain.
 
Figure 1: The first online player in the game,
left corner panel is shown the chain and player information,
right corner panel is shown all players online information,
bottom is shown the waiting message to the player.

 
Figure 2: The second online player in the game,
Two white circles on right corner panel are shown two players are online.
3.	Ready button shows when all players in the chain
 
Figure 3: The last online player in the game,
the green Ready button pops out when all five players in the chain game,
only 30 seconds for all players to ready for the game. 

4.	The green circle on right corner panel shows the player clicked the ready button for the game, and the player can cancel the game by clicking the button again if they are not ready.
 
Figure 4: The last online player in the game,
the green circle shows the player is ready and waiting for the game,
the red Cancel button pops out when the player clicked the ready button before.



 
5.	Once all players are ready by clicking the ready button, the game starts and records the time for completing the challenge through the video chain game.
 
Figure 5: The last online player in the game,
the green circle shows all players are ready,
the bottom blue message and time counter pops out when the game starts,
only the last player has extra button to finish the challenge and the record the complete time for the team in a chain.


•	End the game
1.	The last player clicks on the finish game button.
 
Figure 6: The last online player in the game,
the green circle shows all players are ready,
the bottom red message pops out when the game finishes,
the total used time shows when the game finishes by clicking the finish button.

