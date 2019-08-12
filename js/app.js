//different speeds for light flash
const speeds = {
    slow: 1200,
    quick: 600
}
//stores the time in ms for the round
let lightTimer;
//preloaded fake high scores
const preLoadedScores = [
    {
        name: 'JOJO',
        score: 25
    },
    {
        name: 'BENTON',
        score: 20
    },
    {
        name: 'RAY',
        score: 15
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
//for loading in from preloaded scores or scores in localStorage
let highScores;

const gameButtons = [
    {
        cssClass: "top-left",
        sound: "beam1-spacey.mp3"
    },
    {
        cssClass: "top-right",
        sound: "beam2-zapsplat_beam.mp3"
    },
    {
        cssClass: "bottom-right",
        sound: "beam3-moog-mod.mp3"
    },
    {
        cssClass: "bottom-left",
        sound: "beam4-strange-wave.mp3"
    }
];
//track current player score
let currentScore = 0;
//store Simon's sequence of buttons
let simonSequence = [];
//tracks index of Simon's sequence to compare player's latest input to
let playerIndex = 0;
//flag for whether player can initiate game
let canStart = true;
//flag for whether player can press game keys
let canPlay = false;
//flag for open modal (keys won't respond)
let modalOpen = false;
// for storing  and clearing the player input timeout
let inputCountdown;

//
//high scores
//
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

function updateHighScoreBoard() {
    let scoreContainer = $('.score-container');
    scoreContainer.html("");
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
    highScores.sort((a, b) => {
        a.score < b.score ? 1 : -1;
    });
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
    //old text fades out and new text fades in
    let startButtonText = $('.start-button-text');
    startButtonText.addClass('fade');
    setTimeout(() => {
        startButtonText.html(content);
    }, 200);
    setTimeout(() => {
        startButtonText.removeClass('fade');
    }, 400);
}

function gameOver() {
    $('.end-audio')[0].play();
    updateMiddle('Game Over!<br/>Retry?<br/>')
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
    return playerLight === simonSequence[playerIndex];
}

function clearLights() {
    $('.flash').removeClass('flash');
}

async function playerLight(lightIndex) {
    clearTimeout(inputCountdown);
    clearLights();
    if (!compareLight(lightIndex)) {
        canPlay = false;
        // game over after while still allowing last button to be triggered
        setTimeout(gameOver, lightTimer+100);
    } else {
        playerIndex++;
        if (playerIndex >= simonSequence.length) {
            canPlay = false;
            setTimeout(() => {
                updateScore();
                displayScore();
                playRound();
            }, lightTimer+100);
        } else {
            inputCountdown = setTimeout(gameOver, 10000);
        }
    }
    //small delay for usability
    await timeout(100);
    flashLight(gameButtons[lightIndex].cssClass, lightTimer);
}

function startPlayerTurn() {
    //input timeout is 10s
    inputCountdown = setTimeout(gameOver, 10000);
    updateMiddle('Your Turn');
    canPlay = true;
}

async function displaySimonSeq() {
    await timeout(lightTimer);
    for (let simonLight of simonSequence) {
        flashLight(gameButtons[simonLight].cssClass, lightTimer);
        await timeout(lightTimer);
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

async function startGame() {
    canStart = false;
    $('.start-audio')[0].play();
    //reset the sequence for a new game and get speed
    lightTimer = speeds[$('input[name=game-speed]:checked').val()]
    simonSequence.length = 0;
    updateScore();
    await timeout(lightTimer);
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
            $('<p>Welcome to UFO Simon! The aim is to abduct the animals in the same order as Simon.</p>'),
            $('<p>Before starting, you can pick a game speed in the top left corner.</p>'),
            $('<p>Use your keyboard, your mouse or your touch screen to play the game. The Q W A S keys control the main game buttons. Press Enter or click in the middle to start a new game.</p>'),
            $('<p>When it\'s Simon\'s turn, Simon will move the UFOs one by one.</p>'),
            $('<p>Now it\'s your turn! Press the UFOs in the same order as Simon.</p>'),
            $('<p>Simon will add one more UFO each turn. Try to get the highest score possible!</p>'),
            $('<p>Your high scores can be saved in the scoreboard. Click the high scores button to see them.</p>')
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

function createAudio(cssClass, sound) {
    $(`<audio class="${cssClass}-audio"></audio`).append(`<source src="audio/${sound}" type="audio/mpeg"></source>`).appendTo('body');
}

function constructAudios() {
    gameButtons.forEach(gameButton => {
        createAudio(gameButton.cssClass, gameButton.sound)
    });
    createAudio('start', 'start.mp3');
    createAudio('end', 'end.mp3');
}

$(document).ready(() => {
    addButtonListeners();
    constructModals();
    loadHighScores();
    updateHighScoreBoard();
    constructAudios();
});