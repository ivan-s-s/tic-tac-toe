// Gameboard function
function Gameboard() {
  const board = [];

  for (let i = 0; i < 9; i++) {
    board[i] = [];
    board[i].push(Cell());
  }

  const getBoard = () => board;

  const dropToken = (index, player) => {
    const availableCell = board[index][0].getValue();

    if (availableCell.length > 0) return;
    board[index][0].addToken(player);
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((e) => e.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);
  }

  return {
    getBoard,
    dropToken,
    printBoard
  }
}

function Cell() {
  let value = '';
  const addToken = (player) => {
    value = player;
  }
  const getValue = () => value;
  return {
    addToken,
    getValue
  }
}

function GameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = Gameboard();
  const winnerStatus = WinnerStatus();

  const players = [
    {
      name: playerOneName,
      token: "X",
      value: []
    },
    {
      name: playerTwoName,
      token: "O",
      value: []
    }
  ];

  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  }

  const playRound = (index) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into: ${index}`
    );
    const playerValue = board.getBoard();
    if (playerValue[index][0].getValue().length === 0) {
      board.dropToken(index, getActivePlayer().token);
      activePlayer.value.push(+index);

      if (CheckWin(getActivePlayer().value, index)) {
        printWinner(getActivePlayer().name);
        winnerStatus.changeWinnerStatus();
      } else {
        switchPlayerTurn();
        printNewRound();
      } 
    }
  }

  const printWinner = (playerName) => {
    console.log(`${playerName} WIN!!!`);
  }

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getWinnerStatus: winnerStatus.getWinnerStatus
  };
}

function WinnerStatus() {
  let winner = false;

  const changeWinnerStatus = () => {
    winner = true;
  }
  const getWinnerStatus = () => winner;

  return {
    changeWinnerStatus,
    getWinnerStatus
  }
}

function CheckWin(playerValues, index) {
  const winCombanations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winCombanations.length; i++) {
    let someWinComb = winCombanations[i], count = 0;
    if (someWinComb.indexOf(+index) !== -1) {
      for (let j = 0; j < someWinComb.length; j++) {
        if (playerValues.indexOf(someWinComb[j]) !== -1) {
          count++;
          if (count === 3) {
            return true;
          }
        }
      }
    }
    count = 0;
  }
}

function ScreenController(playerOne, playerTwo) {
  const game = GameController(playerOne, playerTwo);
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.game-board');

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((e, index) => {
      e.forEach((cell) => {
        const cellButton = document.createElement('button');
        cellButton.setAttribute('id', index);
        cellButton.addEventListener('click', clickHandlerButton);
        cellButton.classList.add('field');

        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    })
  }

  const winScreen = () => {
    updateScreen();

    const activePlayer = game.getActivePlayer();

    const winnerDiv = document.getElementById('winnerPopUp');
    winnerDiv.classList.remove('hide');
    winnerDiv.innerHTML = `<p>${activePlayer.name} WIN!!!</p>`;
  }
  
  function clickHandlerButton(e) {
    const selectButton = e.target.id;

    game.playRound(selectButton);
    game.getWinnerStatus() ? winScreen() : updateScreen();
  }

  updateScreen();
}

// function StartController() {
//   const gamePage = ScreenController();
//   const startDiv = document.querySelector('.card');

//   const startScreen = () => {
//     startDiv.
//   }

// }

ScreenController('Ivan', 'Nikita');

// function changeToX() {
//     const xBtn = document.querySelector('.x-btn');
//     const oBtn = document.querySelector('.o-btn');

//     xBtn.classList.add('selected');
//     oBtn.classList.remove('selected');
//     xBtn.classList.remove('not-selected');
//     oBtn.classList.add('not-selected');
// }

// function changeToO() {
//     const xBtn = document.querySelector('.x-btn');
//     const oBtn = document.querySelector('.o-btn');

//     oBtn.classList.add('selected');
//     xBtn.classList.remove('selected');
//     oBtn.classList.remove('not-selected');
//     xBtn.classList.add('not-selected');
// }
