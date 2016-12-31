-----------------------------Standard Directives-----------------------------------

1.DIRROUTETOBOT -change state to connect with aiml(state change to 0). 

2.DIRDEVELOPERSTART -initiate the bot by showing welcome message.

3.DIRROUTETOAI -change state to connect with AI component(state change to 1).

4.DIRROUTETOOPERATOR -change state to connect with human operator(state change to 2).

5.DIRDONOTHING -NO return action.

6.DIRSTORE/ENDDIRSTORE - functioning as container to store values. 

7.DIRUPDATEVARGROUPS/ENDDIRUPDATEVARGROUPS - Update the varGroup. 

8.varGroups - contains many more groups as given below.
	      They are,
		1.VARCUSTOMERNAME.
		2.VARCUSTOMERCITY.
		3.VARUSERNAME.
		4.VARCONSTANT.
				 

--------------------------------config.json----------------------------------------

1.botUrl -URL which is used to connect with program-O.

2.aiUrl - URL which is used by AI component to connect with python program.

3.activemqUrl -URL which is used to connect to activemq Server.

4.activemqLogin -Login username to activemq Server.

5.activemqPW -Login password to activemq Server.

6.activemqDestination -Intermediate state which is used by client to connect with operator(which is set the topic)
		     eg:- /topic/chat.*