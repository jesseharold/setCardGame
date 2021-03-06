# SET!

This is a javascript re-creation of my favorite card game, SET!
You can play online here: 
http://jesseharold.github.io/setCardGame/

## How to Play
To play set, you search a grid of face-up cards to try and find a "SET" of three cards before your opponents.

### What is a set?
A set is three cards that has each card attribute either all the same or all different. Card attributes are: color, shape, number of shapes, and fill.

So, a set could have all red, all diamonds, but 1,2,3 as the numbers, and three different fills. A set can't ever have two greens and one red, or two solid fills and one empty fill. Each feature has to be all the same, or all different.

### Gameplay
When you see a set of three, shout out "SET!" and hit the button or key associated with your name on the board. Then immediately click on the three cards that make up a SET. You must hit the button to call the set before you click on the cards.

If you're right, you keep the cards and get three points. If you're wrong, you lose one point.

The dealer deals out 9 cards at a time, and you keep going until the deck is out.

If all players agree that there are no SETs on the board, click the black button that says "No Sets on the Board." If you're right, the dealer will add more cards to the grid, but you'd be surprised how easy it is to miss one!

This version lets up to six people play at once. 

Features added:
 - A timer once you hit the set button, you forfeit if you don't click three cards within 5 seconds or something
 - in-game instructions
 - on-screen messaging to tell players when they are correct or incorrect about a set

Features I would like to add: 
 - use SVGs instead of pngs, have color and number of shapes be passed in to the SVGs as a query string
 - sounds, you can choose your sound effect that plays when you call a set, and it makes a happy noise when you're right and a shameful noise when you're wrong. 
 - option to turn off timed mode
 - option to play in training mode, where it tells you why something isn't a set, and will give you a hint if you can't find the set on the table
 - option to play in solo mode where you try and beat a total time to clear the deck
 - rewrite as a React app 
 - add a server-side component:
 - save hi scores in db
 - remote mode -- the ability for people to play over the network from different devices using sockets
 - improve UX with other game modes
