let gameButtons = [
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
let simonSequence = [];
let playerSequence = [];

function newSequenceLight() {
    return Math.floor(Math.random() * 4);
}