const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        });
        document.querySelector(".gameboard").innerHTML = boardHTML;
        
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        });
    };

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    };

    const getGameboard = () => gameboard;

    return { render, update, getGameboard };
})();

const createPlayers = (name, mark) => {
    return {
        name, 
        mark
    }
}
const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    const start = () => {
        players = [
            createPlayers(document.querySelector(".player1").value || "Player 1", "X"), 
            createPlayers(document.querySelector(".player2").value || "Player 2", "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        document.querySelector(".message").textContent = ""; 
        Gameboard.render();
    };

    const handleClick = (event) => {
        if (gameOver) return;
        const index = parseInt(event.target.id.split("-")[1]);

        if (Gameboard.getGameboard()[index] !== "") return;

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (checkWin(Gameboard.getGameboard())) {
            gameOver = true;
            document.querySelector(".message").textContent = `${players[currentPlayerIndex].name} Wins!`;
        } else if (checkTie(Gameboard.getGameboard())) {
            gameOver = true;
            document.querySelector(".message").textContent = "It's a tie!";
        } else {
            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        }
    };

    const checkWin = (board) => {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return board[index] === players[currentPlayerIndex].mark;
            });
        });
    };

    const checkTie = (board) => {
        return board.every(square => square !== "");
    };

    return { start, handleClick };
})();

const startButton = document.querySelector(".start");
startButton.addEventListener("click", ()=> {
    Game.start();
});

const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", () => {
    location.reload(); 
});