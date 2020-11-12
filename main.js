const AIcheckbox = document.querySelector("#AI-player");

AIcheckbox.addEventListener('change', (e) => {
    if(e.target.checked)
        document.querySelector("#player-two-wrapper").style = "display: none";
    else
        document.querySelector("#player-two-wrapper").style = "display: block";
});

const GameBoard = (function() {
    const spotList = ['', '', '', '', '', '', '', '', ''];
    let playerList = [];
    let currentPlayer;
    let endgame = false;

    function changePlayer() {
        if(this.currentPlayer == this.playerList[0])
            this.currentPlayer = this.playerList[1];
        else
            this.currentPlayer = this.playerList[0];
    }

    return { spotList, playerList, currentPlayer, changePlayer, endgame }
})();

function makePlayer(letter, name) {
    let spotted = [];
    return { letter, spotted, name }
}

function makeAI() {
    return Object.assign({}, makePlayer('o', 'Artificial Intelligence'), {
        isAI: true
    })
}

function setupBoard() {
    const gameboard_div = document.querySelector("#gameboard");
    gameboard_div.innerHTML = "";
    GameBoard.spotList.forEach((spot, index) => {
        let spotDiv = document.createElement('div');
        spotDiv.innerText = spot;
        spotDiv.classList.add('spotDiv');
        spotDiv.id = index;
        gameboard_div.appendChild(spotDiv);
    });

    if(GameBoard.currentPlayer)
        gameController();
}

function startGame() {
    const player_one_name = document.querySelector("#player-one-name").value || "Player One";
    const player_two_name = document.querySelector("#player-two-name").value || "Player Two";

    let player1 = makePlayer('x', player_one_name);
    let player2;
    
    if(AIcheckbox.checked)
        player2 = makeAI();
    else
        player2 = makePlayer('o', player_two_name);

    player1.spotted = [];
    player2.spotted = [];

    GameBoard.spotList = ['', '', '', '', '', '', '', '', ''];
    GameBoard.endgame = false;

    GameBoard.playerList = [];
    GameBoard.playerList.push(player1);
    GameBoard.playerList.push(player2);

    GameBoard.currentPlayer = GameBoard.playerList[0];

    console.log(player1, player2);
    console.log(GameBoard);
    setupBoard();
}

function gameController() {
    const spotElements = document.querySelectorAll('.spotDiv');
    spotElements.forEach(spot => {
        spot.addEventListener('click', (event) => {
            if(GameBoard.spotList[event.target.id] === "" && GameBoard.endgame === false) {
                GameBoard.spotList[event.target.id] = GameBoard.currentPlayer.letter;
                GameBoard.currentPlayer.spotted.push(event.target.id);
                setupBoard();
                checkForWinner();
                GameBoard.changePlayer();
            }

            if(GameBoard.currentPlayer.isAI && GameBoard.endgame === false){
                let availableSpots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                let unavailableSpots = [...GameBoard.playerList[0].spotted, ...GameBoard.playerList[1].spotted];

                availableSpots = availableSpots.filter((element) => !unavailableSpots.includes(element.toString()));

                const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];

                GameBoard.spotList[randomSpot] = GameBoard.currentPlayer.letter;
                GameBoard.currentPlayer.spotted.push(randomSpot.toString());

                setupBoard();
                checkForWinner();
                GameBoard.changePlayer();
            }
                
        });
    });
}

function checkForWinner() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ];
    
    winConditions.some((r) => {
        let winner = r.every((n) => GameBoard.currentPlayer.spotted.includes(n.toString()));
        if(winner) {
            alert("Winner: " + GameBoard.currentPlayer.name);
            GameBoard.endgame = true;
        }
    });

    if(!GameBoard.spotList.some((spot) => spot === "") && GameBoard.endgame === false) {
        alert("TIE!");
        GameBoard.endgame = true;
    }
}

setupBoard();
