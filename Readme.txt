This is a test.  HELLO, WORLD!

I'm learning how to use GitHub.

Okay, now we're talking. So, just committing doesn't necessarily add that change to github online repo, right?

Yeah, you have to also "sync" the branch. I only have one branch, so I don't really know what that means, but for now, I'll just go with it. 

Okay, for real tho, now, I'm gonna start planning my game code.

OBJECTS

There's going to be a card object, which has attributes: color, shape, number, fill

There's going to be a table, which is an array of rows (3-card arrays), into which cards can be dealt.

And there's a deck, an array of all cards undealt.

Then there's a "pile" for each player, another array where cards go once you've won them, and where they come out of if you make a mistake. 

ACTIONS

- create new deck with all cards
- randomize deck
- deal new table
- deal new row
- call "SET" - pause play
- click on cards to claim a set
- verify claimed cards are a set
- reject set and start play again
- accept set, move cards to user's pile, deal new row, resume play
- test to see if deck is empty
- test to see if there are any possible sets on the table

