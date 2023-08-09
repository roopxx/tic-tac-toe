// Game Module
const gameBoard = (() => {
  // Private
  let board = ["", "", "", "", "", "", "", "", ""];

  //Public
  const getBoard = () => board;

  const isCellEmpty = (index) => board[index] === "";

  const placeMarker = (index, marker) => {
    if (isCellEmpty(index)) {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const clearBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    getBoard,
    isCellEmpty,
    placeMarker,
    clearBoard,
  };
})();

// Control the display
const displayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const message = document.querySelector(".message");
  const finalMessage = document.querySelector(".final-message");
  const restartBtn = document.querySelector(".restart");

  const renderBoard = (board) => {
    board.forEach((marker, index) => {
      cells[index].textContent = marker;
    });
  };

  const showMessage = (msg) => {
    message.textContent = msg.charAt(0).toUpperCase() + msg.slice(1);
  };

  const showWinner = (winner) => {
    finalMessage.style.display = "flex";
    finalMessage.textContent = winner.toUpperCase();
    finalMessage.classList.add("winner");
  };

  const clearMessage = () => {
    message.textContent = "";
  };

  const clearWinner = () => {
    finalMessage.textContent = "";
    finalMessage.classList.remove("winner");
  };

  const addCellClickListener = (callback) => {
    cells.forEach((cell) => cell.addEventListener("click", callback));
  };

  const addRestartClickListener = (callback) => {
    restartBtn.addEventListener("click", callback);
  };

  return {
    renderBoard,
    showMessage,
    showWinner,
    clearMessage,
    clearWinner,
    addCellClickListener,
    addRestartClickListener,
  };
})();

// Player
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

// Gameplay
const game = (player1_name, player2_name) => {
  const player1 = Player(player1_name, "X");
  const player2 = Player(player2_name, "O");
  let currentPlayer = player1;
  let gameEnded = false;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = (board, marker) => {
    // Wining combination
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winCombos.some((combination) => {
      const [a, b, c] = combination;
      return board[a] === marker && board[b] === marker && board[c] === marker;
    });
  };

  const checkTie = (board) => {
    return board.every((cell) => cell !== "");
  };

  const handleCellClick = (e) => {
    const cellIndex = e.target.dataset.index;
    if (gameEnded || !gameBoard.isCellEmpty(cellIndex)) {
      return;
    }

    if (gameBoard.placeMarker(cellIndex, currentPlayer.getMarker())) {
      displayController.renderBoard(gameBoard.getBoard());

      if (checkWin(gameBoard.getBoard(), currentPlayer.getMarker())) {
        displayController.showWinner(`${currentPlayer.getName()} wins!`);
        displayController.clearMessage();
        gameEnded = true;
      } else if (checkTie(gameBoard.getBoard())) {
        displayController.showWinner("It's a tie!");
        displayController.clearMessage();
        gameEnded = true;
      } else {
        switchPlayer();
        displayController.showMessage(`${currentPlayer.getName()}'s Turn`);
      }
    }
  };

  const handleRestartClick = () => {
    gameBoard.clearBoard();
    gameEnded = false;
    currentPlayer = player1;
    displayController.clearMessage();
    displayController.clearWinner();
    displayController.renderBoard(gameBoard.getBoard());
    displayController.showMessage(`${currentPlayer.getName()}'s Turn`);
  };

  displayController.addCellClickListener(handleCellClick);
  displayController.addRestartClickListener(handleRestartClick);
  displayController.showMessage(`${currentPlayer.getName()}'s Turn`);
};

// Initialize the game
const play_btn = document.querySelector(".play_btn");
play_btn.addEventListener("click", () => {
  let player1_name = document.querySelector("#player_one").value;
  let player2_name = document.querySelector("#player_two").value;

  // Handling players without names
  if (player1_name.trim() === "" || player2_name.trim() === "") {
    alert("Please enter names for both players.");
    return;
  }

  var gameDisplay = document.querySelector(".gameplay");
  var playerDisplay = document.querySelector(".player-selection");
  gameDisplay.style.display = "block";
  playerDisplay.style.display = "none";

  // Call the game function with player names
  (function init() {
    game(player1_name, player2_name);
  })();
});
