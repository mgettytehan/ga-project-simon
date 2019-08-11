//preloaded fake high scores
const preLoadedScores = [
    {
        name: 'CHAMP',
        score: 40
    },
    {
        name: 'BEN',
        score: 30
    },
    {
        name: 'JOJO',
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
const gameButtons = [
    {
        cssClass: "top-left",
        sound: "beam2.mp3"
    },
    {
        cssClass: "top-right",
        sound: "beam2.mp3"
    },
    {
        cssClass: "bottom-right",
        sound: "beam2.mp3"
    },
    {
        cssClass: "bottom-left",
        sound: "beam2.mp3"
    }
];
//track current player score
let currentScore = 0;
//store Simon's sequence of buttons
let simonSequence = [];
//tracks index of Simon's sequence to compare player's latest input to
let playerIndex = 0;
//standard for light flashing in ms
const lightTimer = 600;
//flag for whether player can initiate game
let canStart = true;
//flag for whether player can press game keys
let canPlay = false;
//flag for open modal (keys won't respond)
let modalOpen = false;

//
//high scores
//
//use to save into localStorage when changes are made
function saveHighScores() {
    localStorage.highScores = JSON.stringify(highScores);
}

function checkScore(playerScore) {
    return playerScore > highScores[highScores.length - 1].score ? true : false;
}

function updateHighScoreBoard() {
    let scoreContainer = $('.score-container');
    highScores.forEach(scoreObj => {
        scoreContainer.append(`<div>${scoreObj.name}</div>`, `<div>${scoreObj.score}</div>`);
    });
}

function addScore(name) {
    highScores.pop();
    newScore = {};
    newScore.name = name;
    newScore.score = currentScore;
    highScores.push(newScore);
    saveHighScores();
    updateHighScoreBoard();
}

function showNameScreen() {
    let nameModal = createModal('player-name', $('<div></div>').append(
        $('<h2>High Score!</h2>'),
        $('<p>You got a high score! Please enter your name below (1-6 characters).</p>'),
        $('<div class="form-fields"></div>').append(
            $('<div class="warning-text"></div>'),
            $('<input type="text" class="name-field" maxlength="6"></input>'),
            $('<button>Submit</button>').on('click', function() {
                let playerName = $(this).parents('.form-fields').children('.name-field').val();
                if(playerName.length >= 1 && playerName.length <= 6){
                    addScore(playerName.toUpperCase());
                    $(this).parents('.modal').remove();
                } else {
                    $(this).siblings('.warning-text').text('Please enter 1-6 characters!');
                }
            })
        )
    )).removeClass('hidden');
    nameModal.find('.close').on('click', function() {
        $(this).parents('.modal').remove();
    });
    $('body').append(nameModal)
    modalOpen = true;
}

//
//game functionality
//
function timeout(timeMs) {
    return new Promise(resolve => setTimeout(resolve,timeMs));
}

function updateMiddle(content) {
    $('.start-button-text').html(content);
}

function gameOver() {
    updateMiddle('Game Over!<br/>Try Again?<br/>(Enter)')
    //check for new high score
    if (checkScore(currentScore)) {
        showNameScreen();
    }
    canStart = true;
}

function displayScore() {
    $('#score-number').text(currentScore);
}

function updateScore() {
    currentScore = simonSequence.length;
}

//turn on flash class, wait, turn off
async function flashLight(buttonClass, timeMs) {
    $(`.${buttonClass}-audio`)[0].play();
    $(`.${buttonClass}`).addClass('flash');
    await timeout(timeMs);
    $(`.${buttonClass}`).removeClass('flash');
}

function compareLight(playerLight) {
    if (playerLight !== simonSequence[playerIndex]) {
        canPlay = false;
        gameOver();
        return;
    }
    playerIndex++;
    if (playerIndex >= simonSequence.length) {
        canPlay = false;
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
    flashLight(gameButtons[lightIndex].cssClass, lightTimer);
    await timeout(lightTimer);
    compareLight(lightIndex);
}

function startPlayerTurn() {
    updateMiddle('Your Turn');
    canPlay = true;
}

async function displaySimonSeq() {
    await timeout(lightTimer);
    for (let simonLight of simonSequence) {
        flashLight(gameButtons[simonLight].cssClass, lightTimer);
        await timeout(lightTimer * 2);
    }
    startPlayerTurn();
}

//generates number of button to press
function getNewSeqLight() {
    return (Math.floor(Math.random() * 4));
}

function addToSimonSeq() {
    simonSequence.push(getNewSeqLight());
}

function simonTurn() {
    updateMiddle('Simon\'s Turn');
    addToSimonSeq();
    displaySimonSeq();
}

function playRound() {
    //reset player's index for new round
    playerIndex = 0;
    simonTurn();
}

function startGame() {
    canStart = false;
    //reset the sequence for a new game
    simonSequence.length = 0;
    updateScore();
    playRound();
}

function addButtonListeners() {
    $(document).on('keydown', function(evnt) {
        if (modalOpen) {
            return;
        }
        let keyPressed = evnt.which;
        if (canPlay) {
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
        }
        if (canStart && keyPressed === 13) {
            startGame();
        }
    });
    $('.game-button').on('click', function() {
        if (!modalOpen && canPlay) {
            playerLight(
                gameButtons.map(
                    button => button.cssClass
                ).indexOf($(this).attr('id'))
            );
        }
    });
    $('.start-button').on('click', function() {
        if (!modalOpen && canStart) {
            startGame();
        }
    });
    
}
//
//construct modals for page
//
function createModal(divClass, innerContent) {
    return $(`<div class="modal ${divClass} hidden"></div>`).append(innerContent.addClass('modal-inner').append(
        $('<div class="button-container"></div>').append('<button class="close">Close</button>').on('click', function() {
            $(this).parents('.modal').addClass('hidden');
            modalOpen = false;
        })
    ));
}

//create all modals for page, all come out hidden
function constructModals() {
    $('body').append(
        createModal('instructions', $('<div></div>').append(
            $('<h2>Instructions</h2>'),
            $('<p>Press Enter to start a new game.</p>'),
            $('<p>Use the Q W A S keys to play.</p>'),
            $('<p>Simon will start his turn and light up a sequence of UFOs. He will start with one UFO.</p>'),
            $('<p>Now it\'s your turn! Press the UFOs in the same order as Simon.</p>'),
            $('<p>Simon will add one more UFO to the sequence each turn. Try to get the highest score possible!</p>')
        )),
        createModal('scoreboard', $('<div></div>').append(
            $('<h2>High Scores</h2>'),
            $('<div class="score-container"></div>')
        ))
    );
    //add button listeners
    $('.instructions-button').on('click', function() {
        $('.instructions').removeClass('hidden');
        modalOpen = true;
    });
    $('.score-button').on('click', function() {
        $('.scoreboard').removeClass('hidden');
        modalOpen = true;
    });
}
function createAudio() {
    gameButtons.forEach(gameButton => {
        $(`<audio class="${gameButton.cssClass}-audio"></audio`).append(`<source src="audio/${gameButton.sound}" type="audio/mpeg"></source>`).appendTo('body');
    });
}

$(document).ready(() => {
    addButtonListeners();
    constructModals();
    loadHighScores();
    updateHighScoreBoard();
    createAudio();
});