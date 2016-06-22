var clrs = ["red", "green", "purple"];
var fills = ["solid", "empty", "striped"];
var shapes = ["diamond", "oval", "s"];
var numbers = [1, 2, 3];

var myDeck = [];
var myTable = [];
//var myPile = [];
var players = [];
var activePlayer = 10; //zero-indexed
var testMeForSet = [];
var baseImgURL = "http://www.kneesandtoes.org/images/setgamecards/";
var deckIsOut = false;
var keystrokes = ["Z", "P", "Q", "M", "7", "3"]; //players can hit these instead of clicking button

function processPlayerNames() {
  var inputsJ = jQuery("#playerNames>input");
  var buttonsCode = "";
  for (var p = 0; p < inputsJ.length; p++) {
    var thisName = jQuery(inputsJ[p]).val();
    if (thisName.length > 0) {
      players.push({
        name: thisName,
        score: 0,
        pile: []
      });
      buttonsCode += '<div class="setButton" id="player' + players.length + 'SET">SET!<br>' + thisName + ' (' + keystrokes[p] + ')<div class="score" id="scoreBoard' + p + '">cards: 0</div></div>';
    }
  }
  jQuery("#playerNames").html(buttonsCode);

}

function populateDeck() {
  for (var i = 0; i < 3; i++) { //create the colors
    for (var j = 0; j < 3; j++) { //create the fills
      for (var k = 0; k < 3; k++) { //create the shapes
        for (var m = 0; m < 3; m++) { //create the nums
          myDeck.push({
            clr: clrs[i],
            fill: fills[j],
            shape: shapes[k],
            number: numbers[m]
          });
        }
      }
    }
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function dealRow() {
  //clear testme array
  activePlayer = 10; //default value
  clearCurrentSet();
  //pop three cards off deck and push to table array
  if (myDeck.length > 0) {
    myTable.push(myDeck.pop());
    displayTable();
  }
  if (myDeck.length > 0) {
    myTable.push(myDeck.pop());
    displayTable();
  }
  if (myDeck.length > 0) {
    myTable.push(myDeck.pop());
    displayTable();
  } else {
    endOfDeck();
  }

  //if there are still fewer than 9 cards on table, deal another row
  if (myTable.length < 9) {
    dealRow();
  } else {
    checkStacks();
  }
}

function checkStacks() {
  var countML = myDeck.length + " cards left in deck<br>";
  var instructionsLink = '<a href="instructions.html" target="_blank">How to play</a>.';
  for (var i = 0; i < players.length; i++) {
    jQuery("#playerNames #scoreBoard" + i).html("cards: " + players[i].pile.length);
  }
  jQuery("#cardCounts").html(countML + instructionsLink);
}

function displayTable() {
  //clear table

  $('#setTable').html("").show();
  //cycle through table array
  for (var c = 0; c < myTable.length; c++) {
    //create an image with proper src
    var thisCardSrc = baseImgURL + myTable[c].clr + myTable[c].fill + myTable[c].shape + myTable[c].number + '.png';
    $('#setTable').append('<img class="card" id="' + c + '" src="' + thisCardSrc + '" />');
  }
}

function addListeners() {
  jQuery("#setTable").on("click", "img", function() {
    if (!players[activePlayer]) { //check for existence of activeplayer
      showMessage("You have to call a set before clicking on a card.");
    } else {

      var thisCard = myTable[$(this).attr("id")];
      if (jQuery(this).hasClass("hilit")) { // if that card has already been selected
        showMessage("Sorry, you can't un-click.");
      } else {
        //add this card to testme array
        testMeForSet.push(thisCard);
        jQuery(this).addClass("hilit");
        //if testme array has 3 cards in it, run test on it
        if (testMeForSet.length === 3) {
          if (runSetTest(testMeForSet) === true) {
            doFoundaSet(testMeForSet);
          } else {
            doFlubbedaSet();
          }
        } else if (testMeForSet.length > 3) {
          showMessage("Oops! Something went wrong, please start your set over. : /");
          clearCurrentSet();
        }
      }
    } //check for existence of activeplayer
  });

  jQuery("#noSetsButton").click(checkTableforSets);

  jQuery("#beginGame").click(function() {
    processPlayerNames();
    jQuery("#noSetsButton").show();
    jQuery(this).hide();
    dealRow();
  });

  jQuery("#playerNames").on("click", "div.setButton", function() {
    activePlayer = jQuery(this).index();
    showMessage("SET called by " + players[activePlayer].name);
  });
  jQuery(document).keypress(function(e) {
    switch (e.which) {
      // user presses the "z"
      case 122:
        doSetCall(0);
        break;
        // user presses the "p"
      case 112:
        doSetCall(1);
        break;
        // user presses the "q"
      case 113:
        doSetCall(2);
        break;
        // user presses the "m"
      case 109:
        doSetCall(3);
        break;
        // user presses the "7"
      case 55:
        doSetCall(4);
        break;
        // user presses the "3"
      case 51:
        doSetCall(5);
        break;
    }
  });

}

function doSetCall(pIndex) {
  //test to make sure gameplay has started
  if (myTable.length > 7) {
    activePlayer = pIndex;
    showMessage("SET called by " + players[activePlayer].name);
  }
}

function clearCurrentSet() {
  testMeForSet.length = 0;
  jQuery("#setTable img").removeClass("hilit");
  activePlayer = 10; //default value
}

function runSetTest(theseThree) { //returns boolean
  var score = 0;


  //for each attribute, are they all the same? if yes, add a point for each one
  //for each attribute are they all different? a point for each

  //color
  if (theseThree[0].clr == theseThree[1].clr && theseThree[1].clr == theseThree[2].clr) {
    //console.log("color is all the same");
    score++;
  } else if (theseThree[0].clr != theseThree[1].clr && theseThree[1].clr != theseThree[2].clr && theseThree[0].clr != theseThree[2].clr) {
    //console.log("color is all different");
    score++;
  }

  //shape
  if (theseThree[0].shape == theseThree[1].shape && theseThree[1].shape == theseThree[2].shape) {
    //console.log("shape is all the same");
    score++;
  } else if (theseThree[0].shape != theseThree[1].shape && theseThree[1].shape != theseThree[2].shape && theseThree[0].shape != theseThree[2].shape) {
    //console.log("shape is all different");
    score++;
  }

  //fill
  if (theseThree[0].fill == theseThree[1].fill && theseThree[1].fill == theseThree[2].fill) {
    //console.log("fill is all the same");
    score++;
  } else if (theseThree[0].fill != theseThree[1].fill && theseThree[1].fill != theseThree[2].fill && theseThree[0].fill != theseThree[2].fill) {
    //console.log("fill is all different");
    score++;
  }

  //number
  if (theseThree[0].number == theseThree[1].number && theseThree[1].number == theseThree[2].number) {
    //console.log("number is all the same");
    score++;
  } else if (theseThree[0].number != theseThree[1].number && theseThree[1].number != theseThree[2].number && theseThree[0].number != theseThree[2].number) {
    //console.log("number is all different");
    score++;
  }

  //if score is 4, remove these from table, add to pile;

  if (score == 4) {
    return true;
  } else {
    return false;
  }
}

function doFoundaSet(theseThree) {
  showMessage("Correct, " + players[activePlayer].name + "!");
  theseThree.forEach(function(setCard) {
    players[activePlayer].pile.push(setCard);
    var b = myTable.indexOf(setCard);
    if (b > -1) {
      myTable.splice(b, 1);
    }
  });
  if (myTable.length < 9) { //if there are fewer than 9 cards on table, deal 3
    dealRow();
  } else {
    displayTable();
    checkStacks();
  }
}

function doFlubbedaSet() {
  if (players[activePlayer].pile.length > 0) {
    showMessage("That is not a set. You lose one card.");
    myDeck.push(players[activePlayer].pile.pop());
    shuffle(myDeck);
    checkStacks();
  } else {
    showMessage("That is not a set.");
  }
  clearCurrentSet();
}

function checkTableforSets() {
  var foundOne = false;

  for (var c1 = 0; c1 < myTable.length; c1++) {
    for (var c2 = 1; c2 < myTable.length; c2++) {
      for (var c3 = 2; c3 < myTable.length; c3++) {
        if (c1 != c2 && c2 != c3 && c1 != c3) { // can't use a card twice
          if (c2 > c1 && c3 > c2) { //prevent duplicate tests
            var testThese = [myTable[c1], myTable[c2], myTable[c3]];
            if (runSetTest(testThese)) {
              showMessage("answer: " + c1 + ", " + c2 + ", " + c3);
              foundOne = true;
            }
          }
        }
      }
    }
  }

  if (foundOne) {
    showMessage("keep looking");
    clearCurrentSet();
  } else {
    showMessage("You're right, no sets. Dealing more cards.");
    if (deckIsOut) {
      endOfGame();
    } else {
      dealRow();
    }
  }

}

function endOfDeck() {
  deckIsOut = true;
}

function endOfGame() {
  var winningPlayer = 0;
  var runnerUp = 0;
  for (var j = 1; j < players.length; j++) {
    if (players[j].score > players[winningPlayer].score) {
      runnerUp = winningPlayer;
      winningPlayer = j;
    }
  }
  if (players.length > 1 && players[winningPlayer].score == players[runnerUp].score) { //check for a tie
    showMessage("It's a TIE! Nice work, " + players[winningPlayer].name + " and " + players[runnerUp].name + "!");
  } else {
    showMessage("GAME OVER, YOU RULE, " + players[winningPlayer].name + "!");
  }
}

function showMessage(msg) {
  var msgbxJ = jQuery("#gameMessageBox").show();
  msgbxJ.prepend("<div class='singleMsg'>" + msg + "</div>");
}

function init() {
  populateDeck();
  shuffle(myDeck);
  displayTable();
  addListeners();
}
jQuery(document).ready(init);
