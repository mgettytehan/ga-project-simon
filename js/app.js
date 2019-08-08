const gameButtons = [
    {
        cssClass: "top-left",
        sound: ""
    },
    {
        cssClass: "top-right",
        sound: ""
    },
    {
        cssClass: "bottom-right",
        sound: ""
    },
    {
        cssClass: "bottom-left",
        sound: ""
    }
];
//track current player score
let currentScore = 0;
//store Simon's sequence of buttons
let simonSequence = [];
//tracks index of Simon's sequence to compare player's latest input to
let playerIndex = 0;
//storage for clearing interval
let simonInterval;

function timeout(timeMs) {
    return new Promise(resolve => setTimeout(resolve,timeMs));
}

function addStartListener() {
    $(document).on('keydown', function(evnt) {
        //tests for enter key
        if (evnt.which === 13) {
            startGame();
        }
    });
}

//placeholder for console testing
function gameOver() {
    console.log('lost');
    addStartListener();
}

function displayScore() {
    console.log('Score: ' + currentScore);
}

function updateScore() {
    currentScore = simonSequence.length;
}

function removeAllListeners() {
    $(document).off();
}

//return true if light is on, false if off
function toggleLight(buttonClass) {
    //add flash class or remove after delay
    let button = $(`.${buttonClass}`);
    if (button.hasClass('flash')) {
        $(`.${buttonClass}`).removeClass('flash');
        return false;
    } else {
        $(`.${buttonClass}`).addClass('flash');
        return true;
    }
}

function compareLight(playerLight) {
    console.log(playerLight);
    if (playerLight !== simonSequence[playerIndex]) {
        removeAllListeners();
        gameOver();
        return;
    }
    playerIndex++;
    if (playerIndex >= simonSequence.length) {
        removeAllListeners();
        updateScore();
        playRound();
    }
}

function clearLights() {
    $('.flash').removeClass('flash');
}

async function playerLight(lightIndex) {
    clearLights();
    await timeout(100);
    toggleLight(gameButtons[simonSequence[playerIndex]].cssClass);
    await timeout(500);
    toggleLight(gameButtons[simonSequence[playerIndex]].cssClass);
    compareLight(lightIndex);
}

function addButtonListeners() {
    $(document).on('keydown', function(evnt) {
        let keyPressed = evnt.which;
        switch (keyPressed) {
            //q key
            case 81:
                playerLight(0);
                break;
            //w key
            case 87:
                playerLight(1);
                break;
            // s key
            case 83:
                playerLight(2);
                break;
            //a key
            case 65:
                playerLight(3);
                break;
            default:
                break;
        }
    });
}

function startPlayerTurn() {
    addButtonListeners();
}

function showSimonLight() {
    //when light turns off again, move on to next light
    if (!toggleLight(gameButtons[simonSequence[simonIndex]].cssClass)) {
        simonIndex++;
    }
    if (simonIndex >= simonSequence.length) {
        clearInterval(simonInterval);
        startPlayerTurn();
    }
}

//placeholder for console testing
function displaySimonSeq() {
    simonInterval = setInterval( function() {
        showSimonLight();
    },1000);
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

function playRound() {
    //reset indexes for the new round
    simonIndex = 0;
    playerIndex = 0;
    simonTurn();
}

function startGame() {
    removeAllListeners();
    simonSequence.length = 0;
    playRound();
}

$(document).ready(addStartListener);