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

let currentScore = 0;
const simonSequence = [];

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
//placeholder for console testing
function getPlayerLight() {
    return 0;
}

function compareLight(buttonNo) {
    console.log(buttonNo);
    if (getPlayerLight() !== buttonNo) {
        return false;
    }
    return true;
}

function updateScore() {
    currentScore = simonSequence.length;
    console.log('Score: ' + currentScore);
}

function playerTurn() {
    for(let i = 0; i < simonSequence.length; i++) {
        if(!compareLight(simonSequence[i])) {
            return false;
        }
    }
    updateScore();
    return true;
}

function playGame() {
    let playing = true;
    do {
        simonTurn();
        playing = playerTurn();
    } while(playing);
}

function startGame() {
    playGame();
    console.log('lost');
}

//placeholder for testing
function playerLight(button) {
    console.log('button: '+ button);
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

$(document).ready(function() {
    addButtonListeners();
})
