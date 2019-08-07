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

function newSeqLight() {
    return (Math.floor(Math.random() * 4));
}

function addToSimonSeq() {
    simonSequence.push(newSeqLight());
}
//placeholder for console testing
function displaySimonSeq() {
    console.log(simonSequence);
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
    if (getPlayerLight() !== buttonNo) {
        return false;
    }
    return true;
}

function playerTurn() {
    for(let i = 0; i < simonSequence.length; i++) {
        if(!compareLight(simonSequence[i])) {
            return false;
        }
    }
    return true;
}