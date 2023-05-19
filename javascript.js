const modal = document.querySelector('.modal');
const form = document.querySelector('#form');

window.addEventListener('DOMContentLoaded', (event) => {
  modal.showModal();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  game(data);
  modal.close();
});

const game = (data) => {
  let board = gameBoard.board;
  const player1 = Player(data.player1Name, 'X');
  const player2 = Player(data.player2Name, 'O');
  const choice = data.choice;
  let round = 0;
  let currentPlayer = player1.getPlayerMark();
  let gameOver = false;
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  game.playMove = (box) => {
    if (gameOver || round > 8) {
      return;
    }

    if (board[box.id] === 'X' || board[box.id] === 'O') {
      return;
    }

    board[box.id] = currentPlayer;
    box.textContent = currentPlayer;
    box.classList.add(currentPlayer === 'X' ? 'player1' : 'player2');
    round++;

    if (game.endConditions(board)) {
      return;
    }

    if (choice === '0') {
      game.changePlayer(currentPlayer);
    }
  };

  game.changePlayer = (player) => {
    currentPlayer =
      player === player1.getPlayerMark()
        ? player2.getPlayerMark()
        : player1.getPlayerMark();
    let displayText =
      currentPlayer === 'X' ? player1.getPlayerName() : player2.getPlayerName();
    displayController.displayTurn('status', `${displayText} turn`);
  };

  game.endConditions = (board) => {
    if (game.checkWinner(board, currentPlayer)) {
      let winner =
        currentPlayer === 'X'
          ? player1.getPlayerName()
          : player2.getPlayerName();
      displayController.displayTurn('status', winner + ' has won the game');
      return true;
    } else if (round === 9) {
      displayController.displayTurn('status', 'Its a tie!');
      gameOver = true;
      return true;
    }
    return false;
  };

  game.checkWinner = (board, currentPlayer) => {
    let result = false;
    winningConditions.forEach((condition) => {
      if (
        board[condition[0]] === currentPlayer &&
        board[condition[1]] === currentPlayer &&
        board[condition[2]] === currentPlayer
      ) {
        result = true;
      }
    });
    return result;
  };

  displayController.displayTurn('status', `${player1.getPlayerName()} turn`);
  gameBoard.addEventListenersToGameBoard();
};

const gameBoard = (() => {
  let board = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];

  const addEventListenersToGameBoard = () => {
    document.querySelectorAll('.box').forEach((box) => {
      box.addEventListener('click', (event) => {
        game.playMove(event.target);
      });
    });
  };
  return {
    addEventListenersToGameBoard,
    board,
  };
})();

const displayController = (() => {
  const displayTurn = (className, textContent) => {
    const element = document.querySelector(`.${className}`);
    element.textContent = textContent;
  };

  return {
    displayTurn,
  };
})();

const Player = (name, mark) => {
  const playerName = name;
  const playerMark = mark;
  const getPlayerName = () => playerName;
  const getPlayerMark = () => playerMark;
  return {
    getPlayerName,
    getPlayerMark,
  };
};
