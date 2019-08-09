//
//high scores
//
//preloaded fake high scores
const preLoadedScores = [
    {
        name: 'CHAMP',
        score: 40
    },
    {
        name: '',
        score: 30
    },
    {
        name: '',
        score: 20
    },
    {
        name: 'YUKI',
        score: 10
    },
    {
        name: 'YUMI',
        score: 5
    }
];
let highScores;

//load high scores from template or localStorage when page loads
function loadHighScores() {
    if (localStorage.highScores) {
        highScores = JSON.parse(localStorage.highScores);
    } else {
        highScores = preLoadedScores;
    }
}

//use to save into localStorage when changes are made
function saveHighScores() {
    localStorage.highScores = JSON.stringify(highScores);
}

function checkScore(playerScore) {
    return playerScore > highScores[highScores.length - 1].score ? true : false;
}

function addScore(name) {
    highScores.pop();
    newScore = {};
    newScore.name = name;
    newScore.score = currentScore;
    highScores.push(newScore);
}

function showNameScreen() {
    $('.player-name').removeClass('hidden');
}

//
//game functionality
//
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
    //check for new high score
    if (checkScore(currentScore)) {
        showNameScreen();
    }
    addStartListener();
}

function displayScore() {
    $('#score-number').text(currentScore);
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
        displayScore();
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

//
//construct modals for page
//
function createModal(divClass) {
    return $(`<div class="modal ${divClass}"></div>`).append('<div class="modal-inner"></div>').append('<div class="button-container"></div>').append('<button class="close">Close</button>').on('click', function() {
        $(this).parents('.modal').addClass('hidden');
    });
}
//create all modals for page, all come out hidden
function constructModals() {
    $('body').append(
        createModal('player-name').append(
        $('<h2>High Score!</h2>'),
        $('<p>You got a high score! Please enter your name below (1-6 characters).</p>'),
        $('<div></div>').append(
            $('<div class="warning-text"></div>'),
            $('<input type="text" class="name-field" maxlength="6"></input>'),
            $('<button>Submit</button>').on('click', function () {
                let playerName = $(this).siblings('.name-field').value();
                if(playerName.length >= 1 && playerName.length <= 6){
                    addScore(playerName.toUpperCase());
                    $(this).parents('.modal').addClass('hidden');
                } else {
                    $(this).siblings('.warning-text').text('Please enter 1-6 characters!');
                }
            })
        )),
        createModal('instructions').append(
            $('<h2>Instructions</h2>'),
            $('<p>Press Enter to start a new game.</p>'),
            $('<p>Use the Q W A S keys to play.</p>'),
            $('<p>Simon will start his turn and light up a sequence of UFOs. He will start with one UFO.</p>'),
            $('<p>Now it\'s your turn! Press the UFOs in the same order as Simon.</p>'),
            $('<p>Simon will add one more UFO to the sequence each turn. Try to get the highest score possible!</p>')
        ),
        createModal('scoreboard').append(
            $('<h2>High Scores</h2>'),
            $('<div class="score-container"></div>')
        )
    );
    //add button listeners
    // $('.instructions-button').on('click', function() {
    //     $('.instructions').removeClass('hidden');
    // });
    // $('.score-button').on('click', function() {
    //     $('.scoreboard').removeClass('hidden');
    // });
}

$(document).ready(() => {
    addStartListener();
    loadHighScores();
    constructModals();
});