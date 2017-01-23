var colors = ["red", "green", "purple"];
var fills = ["solid", "empty", "striped"];
var shapes = ["diamond", "oval", "s"];
var numbers = [1, 2, 3];

var myDeck = [];
var unshuffledDeck = [];
var myTable = [];
var players = [];
var activePlayer = 10; //zero-indexed
var testMeForSet = [];
var baseImgURL = "http://www.kneesandtoes.org/images/setgamecards/";
var deckIsOut = false;
var keystrokes = ["Z", "P", "Q", "M", "7", "3"]; //players can hit these instead of clicking button
var buttoncolors = ["coral", "lightgreen", "#dcdc1e", "#f77474", "lightblue", "violet"]; //

function processPlayerNames() {
  $("#playerNames input").each(function(index, value){
    //console.log("processing " + $(value));
    var thisName = $(value).val();
    if (thisName.trim().length > 0) {
      players.push({
        name: thisName,
        score: 0,
        keyLetter: keystrokes[index],
        pile: []
      });
      addSetButton(players.length-1);
    }
  });
}

function addSetButton(id){
    var playerButton = $("<div>")
      .addClass("setButton")
      .addClass("button")
      .data("playerId", id)
      .html("<h4>SET!</h4>" + players[id].name + " ( " + keystrokes[id] + " )")
      .css("background-color", buttoncolors[id]);
    var score = $('<div class="score" id="scoreBoard' + id + '">cards: 0</div>');
    playerButton.append(score);
    $("#gameControls").append(playerButton);
}

function populateDeck() {
  var deckLocation = 0;
  for (var i = 0; i < 3; i++) { //create the colors
    for (var j = 0; j < 3; j++) { //create the fills
      for (var k = 0; k < 3; k++) { //create the shapes
        for (var m = 0; m < 3; m++) { //create the nums
          var newCard = {
            color: colors[i],
            fill: fills[j],
            shape: shapes[k],
            number: numbers[m],
            id: deckLocation
          }
          unshuffledDeck.push(newCard);
          myDeck.push(newCard);
          deckLocation++;
        }
      }
    }
  }
}

function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
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
  var cardsDealt = 0;
  while (myDeck.length > 0 && cardsDealt < 3) {
    myTable.push(myDeck.pop());
    cardsDealt++;
  }
  displayTable();
  showCardCounts();
}

function showCardCounts() {
  for (var i = 0; i < players.length; i++) {
    $("#gameControls #scoreBoard" + i).html("cards: " + players[i].pile.length);
  }
  $("#cardCounts .number").text(myDeck.length);
}

function displayTable() {
  //clear table
  $("#setTable").html("").show();
  //cycle through table array
  for (var c = 0; c < myTable.length; c++) {
    //create an image with proper src
    var thisCardSrc = baseImgURL + myTable[c].color + myTable[c].fill + myTable[c].shape + myTable[c].number + '.png';
    var newImage = $("<img>")
      .addClass("card")
      .attr("id", c)
      .attr("src", thisCardSrc)
      .data("deckLocation", myTable[c].id);
    $("#setTable").append(newImage);
  }
}

function guessCard(thisCard){
    if (!players[activePlayer]) { //check for existence of activeplayer
      showMessage("You have to call a set before clicking on a card.");
      clearCurrentSet();
    } else {
      if (thisCard.hasClass("hilit")) { // if that card has already been selected
        showMessage("Sorry, you can't un-click a selected card.");
      } else {
        //add this card to testme array
        var cardData = myTable[parseInt(thisCard.attr("id"))];
        testMeForSet.push(cardData);
        thisCard.addClass("hilit");
        //if testme array has 3 cards in it, run test on it
        if (testMeForSet.length === 3) {
          if (runSetTest(testMeForSet) === true) {
            doFoundaSet(testMeForSet);
          } else {
            doFlubbedaSet();
          }
        } else if (testMeForSet.length > 3) {
          //just in case last set didn't get cleared
          testMeForSet = testMeForSet.slice(3);
        }
      }
    } //check for existence of activeplayer
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
  $("#setTable img").removeClass("hilit");
  activePlayer = 10; //default value
}

function runSetTest(cards) { //returns boolean
  var score = 0;
  //for each attribute, are they all the same? if yes, add a point for each one
  //for each attribute are they all different? a point for each
  //console.log(cards[0], cards[1], cards[2]);
  if (cards[0].color === cards[1].color && cards[1].color === cards[2].color) {
    //console.log("color is all the same");
    score++;
  } else if (cards[0].color != cards[1].color && cards[1].color != cards[2].color && cards[0].color != cards[2].color) {
    //console.log("color is all different");
    score++;
  }

  //shape
  if (cards[0].shape === cards[1].shape && cards[1].shape === cards[2].shape) {
    //console.log("shape is all the same");
    score++;
  } else if (cards[0].shape != cards[1].shape && cards[1].shape != cards[2].shape && cards[0].shape != cards[2].shape) {
    //console.log("shape is all different");
    score++;
  }

  //fill
  if (cards[0].fill === cards[1].fill && cards[1].fill === cards[2].fill) {
    //console.log("fill is all the same");
    score++;
  } else if (cards[0].fill != cards[1].fill && cards[1].fill != cards[2].fill && cards[0].fill != cards[2].fill) {
    //console.log("fill is all different");
    score++;
  }

  //number
  if (cards[0].number === cards[1].number && cards[1].number === cards[2].number) {
    //console.log("number is all the same");
    score++;
  } else if (cards[0].number != cards[1].number && cards[1].number != cards[2].number && cards[0].number != cards[2].number) {
    //console.log("number is all different");
    score++;
  }

  //if score is 4 (4 attributes), SET checks out
  if (score == 4) {
    return true;
  } else {
    return false;
  }
}

function doFoundaSet(theseThree) {
  showMessage("Correct, " + players[activePlayer].name + "!");
  // remove these cards from table, add to player's pile
  theseThree.forEach(function(setCard) {
    players[activePlayer].pile.push(setCard);
    var b = myTable.indexOf(setCard);
    if (b > -1) {
      myTable.splice(b, 1);
    }
  });
  clearCurrentSet();
  if (myTable.length < 9) { //if there are fewer than 9 cards on table, deal 3
    dealRow();
  } else {
    displayTable();
    showCardCounts();
  }
}

function doFlubbedaSet() {
  if (players[activePlayer].pile.length > 0) {
    showMessage("That is not a set. You lose one card.");
    myDeck.push(players[activePlayer].pile.pop());
    shuffle(myDeck);
    showCardCounts();
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
  var msgbxJ = $("#gameMessageBox").fadeIn();
  msgbxJ.text(msg);
  console.log(msg);
  setTimeout(function(){
    msgbxJ.fadeOut(1500);
  }, 2000);
}

function addListeners() {
  $("#setTable").on("click", "img", function() {
    guessCard($(this));
  });

  $("#noSetsButton").click(checkTableforSets);

  $("#beginGame").click(function() {
    processPlayerNames();
    $("#instructions").addClass("collapsed");
    $("#noSetsButton").show();
    $("#cardCounts").show();
    $("#playerNames").hide();
    $(this).hide();
    while (myTable.length < 9){
      dealRow();
    }
  });

  $("#gameControls").on("click", "div.setButton", function() {
    activePlayer = $(this).data("playerId");
    showMessage("SET called by " + players[activePlayer].name);
  });

  $("#cardCounts").on("click", ".howToPlay", function() {
    $("#instructions").css("width", "100%").toggleClass("collapsed");
    if ($("#instructions").hasClass("collapsed")){
      $("#cardCounts .howToPlay").text("How to Play");
    } else {
      $("#cardCounts .howToPlay").text("Close Instructions");
    }
  });

  $(document).keypress(function(e) {
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

function init() {
  populateDeck();
  shuffle(myDeck);
  displayTable(); 
  addListeners();
}
$(document).ready(init);
