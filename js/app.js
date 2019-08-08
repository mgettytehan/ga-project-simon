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

//turn on flash class, wait, turn off
async function flashLight(buttonClass, timeMs) {
    $(`.${buttonClass}`).addClass('flash');
    await timeout(timeMs);
    $(`.${buttonClass}`).removeClass('flash');
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
    flashLight(gameButtons[lightIndex].cssClass, 500);
    await timeout(1000);
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

// function showSimonLight(light) {
//     flashLight(gameButtons[light].cssClass);
// }

//placeholder for console testing
async function displaySimonSeq() {
    await timeout(500);
    for (let simonLight of simonSequence) {
        flashLight(gameButtons[simonLight].cssClass, 500);
        await timeout(1000);
    }
    startPlayerTurn();
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
    console.log('Playing game');
    removeAllListeners();
    simonSequence.length = 0;
    playRound();
}

$(document).ready(addStartListener);