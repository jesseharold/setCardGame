var clrs = ["red", "green", "purple"];
var fills = ["solid", "empty", "striped"];
var shapes = ["diamond", "oval", "s"];
var numbers = [1, 2, 3];

var myDeck = [];
var myTable = [];
var myPile = [];
var testMeForSet = [];
var baseImgURL = "http://www.kneesandtoes.org/images/setgamecards/";

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
    testMeForSet.length = 0;
    //pop three cards off deck and push to table array

    myTable.push(myDeck.pop());
    displayTable();
    myTable.push(myDeck.pop());
    displayTable();
    myTable.push(myDeck.pop());
    displayTable();

    //if there are still fewer than 9 cards on table, deal another row
    if (myTable.length < 9) {
        dealRow();
    } else {
        checkStacks();
    }
}

function checkStacks() {
    console.log(myDeck.length + " now in deck" + myTable.length + " now on table" + myPile.length + " now in user pile");
}

function displayTable() {
    //clear table
    $('#setTable').html("");
    //cycle through table array
    for (var c = 0; c < myTable.length; c++) {
        //create an image with proper src
        var thisCardSrc = baseImgURL + myTable[c].clr + myTable[c].fill + myTable[c].shape + myTable[c].number + '.png';
        $('#setTable').append('<img class="card" id="' + c + '" src="' + thisCardSrc + '" />');
    }
}

function addListeners() {
    jQuery("#setTable>img").live("click", function () {
        var thisCard = myTable[$(this).attr("id")];
        //add this card to testme array
        testMeForSet.push(thisCard);
        //if testme array has 3 cards in it, run test on it
        if (testMeForSet.length === 3) {
            if (runSetTest(testMeForSet) === true) {
                doFoundaSet(testMeForSet);
            } else {
                doFlubbedaSet();
            }
        }
    });
    jQuery("#noSetsButton").click(checkTableforSets);
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
    console.log("set!");
    theseThree.forEach(function (setCard) {
        myPile.push(setCard);
        var b = myTable.indexOf(setCard);
        if (b > -1) {
            myTable.splice(b, 1);
        }
    });
    if (myTable.length < 9) { //if there are fewer than 9 cards on table, deal 3
        dealRow();
    } else {
        displayTable();
    }
}

function doFlubbedaSet() {
    console.log("Wrong.");
    if (myPile.length > 0) {
        console.log("You lose one card.");
        myDeck.push(myPile.pop());
        shuffle(myDeck);
        checkStacks();
    }
    testMeForSet.length = 0;
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
                            console.log("found one: " + c1 + ", " + c2 + ", " + c3);
                            foundOne = true;
                        }
                    }
                }
            }
        }
    }

    if (foundOne) {
        console.log("keep looking");
        doFlubbedaSet();
    } else {
        console.log("you're right");
        dealRow();
    }

}

function init() {
    populateDeck();
    shuffle(myDeck);
    displayTable();
    dealRow();
    addListeners();
}

init();
