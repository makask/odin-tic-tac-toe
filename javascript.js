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
    } else if (choice === '1') {
      game.easyAiTurn();
      currentPlayer = player1.getPlayerMark();
    } else if (choice === '2') {
      game.changePlayer(currentPlayer);
      game.hardAiTurn();
      if (game.endConditions(board)) {
        return;
      }
      game.changePlayer(currentPlayer);
    }
  };

  game.easyAiTurn = () => {
    game.changePlayer(currentPlayer);
    round++;
    let spaceAvailable = board.filter(
      (space) => space !== 'X' && space !== 'O'
    );

    let aiMove =
      spaceAvailable[Math.floor(Math.random() * spaceAvailable.length)];

    board[aiMove] = player2.getPlayerMark();
    setTimeout(() => {
      let box = document.getElementById(`${aiMove}`);
      box.textContent = player2.getPlayerMark();
      box.classList.add('player2');
    }, 200);

    if (game.endConditions(board)) {
      return;
    }
    game.changePlayer(currentPlayer);
  };

  game.hardAiTurn = () => {
    round++;
    const move = minimax(board, 'O').index;
    board[move] = player2.getPlayerMark();
    let box = document.getElementById(`${move}`);
    box.textContent = player2.getPlayerMark();
    box.classList.add('player2');
  };

  const minimax = (board, currentPlayer) => {
    let spacesAvailable = board.filter(
      (space) => space !== 'X' && space !== 'O'
    );
    if (game.checkWinner(board, player1.getPlayerMark())) {
      return {
        score: -100,
      };
    } else if (game.checkWinner(board, player2.getPlayerMark())) {
      return {
        score: 100,
      };
    } else if (spacesAvailable.length === 0) {
      return {
        score: 0,
      };
    }

    const potentialMoves = [];

    for (let i = 0; i < spacesAvailable.length; i++) {
      let move = {};
      move.index = board[spacesAvailable[i]];
      board[spacesAvailable[i]] = currentPlayer;
      if (currentPlayer === player2.getPlayerMark()) {
        move.score = minimax(board, player1.getPlayerMark()).score;
      } else {
        move.score = minimax(board, player2.getPlayerMark()).score;
      }
      board[spacesAvailable[i]] = move.index;
      potentialMoves.push(move);
    }
    let bestMove = 0;
    if (currentPlayer === player2.getPlayerMark()) {
      let bestScore = -10000;
      for (let i = 0; i < potentialMoves.length; i++) {
        if (potentialMoves[i].score > bestScore) {
          bestScore = potentialMoves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < potentialMoves.length; i++) {
        if (potentialMoves[i].score < bestScore) {
          bestScore = potentialMoves[i].score;
          bestMove = i;
        }
      }
    }
    return potentialMoves[bestMove];
  };

  game.changePlayer = (player) => {
    currentPlayer =
      player === player1.getPlayerMark()
        ? player2.getPlayerMark()
        : player1.getPlayerMark();
    let displayText =
      currentPlayer === 'X' ? player1.getPlayerName() : player2.getPlayerName();
    displayController.displayTurn('status', `${displayText}'s turn`);
  };

  game.endConditions = (board) => {
    if (game.checkWinner(board, currentPlayer)) {
      let winner =
        currentPlayer === 'X'
          ? player1.getPlayerName()
          : player2.getPlayerName();
      displayController.displayTurn('status', winner + ' has won the game !');
      gameBoard.removeBoardEventListeners();
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

  game.reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = i;
    }
    document.querySelectorAll('.box').forEach((box) => {
      box.textContent = '';
      box.classList.remove('player1');
      box.classList.remove('player2');
    });
    round = 0;
    currentPlayer = player1.getPlayerMark();
    gameOver = false;

    displayController.displayTurn(
      'status',
      `${player1.getPlayerName()}'s turn`
    );
    gameBoard.addEventListenersToGameBoard();
  };

  game.newGame = () => {
    location.reload();
  };

  displayController.displayTurn('status', `${player1.getPlayerName()}'s turn`);
  gameBoard.addEventListenersToGameBoard();
};

const gameBoard = (() => {
  let board = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];

  const handleClick = (event) => {
    game.playMove(event.target);
  };

  const addEventListenersToGameBoard = () => {
    document.querySelectorAll('.box').forEach((box) => {
      box.addEventListener('click', handleClick);
    });
    document
      .getElementById('newGameButton')
      .addEventListener('click', game.newGame);
    document
      .getElementById('resetButton')
      .addEventListener('click', game.reset);
  };

  const removeBoardEventListeners = () => {
    document.querySelectorAll('.box').forEach((box) => {
      box.removeEventListener('click', handleClick);
    });
  };

  return {
    removeBoardEventListeners,
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
