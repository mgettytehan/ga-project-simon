const gameButtons = [
    {
        class: "top-left",
        sound: ""
    },
    {
        class: "top-right",
        sound: ""
    },
    {
        class: "bottom-right",
        sound: ""
    },
    {
        class: "bottom-left",
        sound: ""
    }
];
//track current player score
let currentScore = 0;
//store Simon's sequence of buttons
const simonSequence = [];
//tracks index of Simon's sequence to compare player's latest input to
let playerIndex = 0;

//placeholder for console testing
function gameOver() {
    console.log('lost');
}

//placeholder for console testing
function displaySimonSeq() {
    console.log(simonSequence);
}

//generates number of button to press
function newSeqLight() {
    return (Math.floor(Math.random() * 4));
}

function addToSimonSeq() {
    simonSequence.push(newSeqLight());
}

function simonTurn() {
    addToSimonSeq();
    displaySimonSeq();
}

function compareLight(playerLight) {
    console.log(playerLight);
    if (playerLight !== simonSequence[playerIndex]) {
        gameOver();
        return;
    }
    playerIndex++;
    if (playerIndex >= simonSequence.length) {
        playRound();
    }
}

function addButtonListeners() {
    $(document).on('keydown', function(evnt) {
        let keyPressed = evnt.which;
        switch (keyPressed) {
            //q key
            case 81:
                compareLight(0);
                break;
            //w key
            case 87:
                compareLight(1);
                break;
            // s key
            case 83:
                compareLight(2);
                break;
            //a key
            case 65:
                compareLight(3);
                break;
            default:
                break;
        }
    });
}

function updateScore() {
    currentScore = simonSequence.length;
    console.log('Score: ' + currentScore);
}

function startPlayerTurn() {
    addButtonListeners();
}

function playRound() {
    //reset playerIndex for the new round
    playerIndex = 0;
    simonTurn();
    startPlayerTurn();
}

function startGame() {
    playRound();
}

$(document).ready(startGame);