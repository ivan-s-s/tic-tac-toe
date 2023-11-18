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

  const clearBoard = () => {
    board.forEach((e) => e.map((cell) => cell.clearValue()));
  }

  return {
    getBoard,
    dropToken,
    clearBoard
  }
}

function Cell() {
  let value = '';
  const addToken = (player) => {
    value = player;
  }
  const getValue = () => value;
  const clearValue = () => {
    value = '';
  }
  return {
    addToken,
    getValue,
    clearValue
  }
}

function GameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2",
  playerOneToken,
  playerTwoToken
) {
  const board = Gameboard();
  const winnerStatus = WinnerStatus();

  const players = [
    {
      name: playerOneName,
      token: playerOneToken,
      value: []
    },
    {
      name: playerTwoName,
      token: playerTwoToken,
      value: []
    }
  ];

  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  const clearPlayersValue = () => {
    players.forEach((e) => e.value = []);
  }

  const playRound = (index) => {
    const playerValue = board.getBoard();
    if (playerValue[index][0].getValue().length === 0) {
      board.dropToken(index, getActivePlayer().token);
      activePlayer.value.push(+index);

      if (CheckWin(getActivePlayer().value, index)) {
        winnerStatus.changeWinnerStatus();
      } else {
        switchPlayerTurn();
      } 
    }
  }

  const restartGame = () => {
    board.clearBoard();
    clearPlayersValue();
    activePlayer = players[0];
  }

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getWinnerStatus: winnerStatus.getWinnerStatus,
    restartGame,
    restartWinnerStatus: winnerStatus.restartWinnerStatus
  };
}

function WinnerStatus() {
  let winner = false;

  const changeWinnerStatus = () => {
    winner = true;
  }
  const restartWinnerStatus = () => {
    winner = false;
  }
  const getWinnerStatus = () => winner;

  return {
    changeWinnerStatus,
    restartWinnerStatus,
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

function ScreenController(playerOne, playerTwo, tokenOne, tokenTwo) {
  const game = GameController(playerOne, playerTwo, tokenOne, tokenTwo);
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.game-board');
  const restartDiv = document.querySelector('.restart-btn');

  const updateScreen = () => {
    restartDiv.addEventListener('click', clickRestartButton);
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

  const clickRestartButton = () => {
    game.restartGame();
    updateScreen();
  }

  const clickWinRestartButton = () => {
    clickRestartButton();

    const winnerDiv = document.getElementById('winnerPopUp');
    game.restartWinnerStatus();
    winnerDiv.classList.add('hide');
  }

  const winScreen = () => {
    updateScreen();

    const activePlayer = game.getActivePlayer();

    const winnerDiv = document.getElementById('winnerPopUp');
    winnerDiv.classList.remove('hide');
    winnerDiv.innerHTML = `<p>${activePlayer.name} WIN!!!</p><button class="win-restart-btn">Еще раз</button>`;

    const restartWinDiv = document.querySelector('.win-restart-btn');
    restartWinDiv.addEventListener('click', clickWinRestartButton);
  }
  
  function clickHandlerButton(e) {
    const selectButton = e.target.id;

    game.playRound(selectButton);
    game.getWinnerStatus() ? winScreen() : updateScreen();
  }

  updateScreen();
}

function StartController() {
  const playerOneName = document.getElementById('playerOne');
  const playerTwoName = document.getElementById('playerTwo');

  let currentTokenOneDiv = document.querySelector('.player-one-token');
  let currentTokenTwoDiv = document.querySelector('.player-two-token');

  const changeToken = () => {
    let firstToken = currentTokenOneDiv.textContent;
    let secondToken = currentTokenTwoDiv.textContent;

    currentTokenOneDiv.textContent = secondToken;
    currentTokenTwoDiv.textContent = firstToken;
  }

  const tokenButtonDivs = document.querySelectorAll('.btn-pick');
  tokenButtonDivs.forEach((e) => e.addEventListener('click', changeToken));

  const getValues = () => {
    let firstN = playerOneName.value;
    let secondN = playerTwoName.value;
    if (firstN.length === 0 && secondN.length === 0) {
      firstN = "Player 1"
      secondN = "Player 2"
    } else if (firstN.length === 0) {
      firstN = "Player 1"
    } else if (secondN.length === 0) {
      secondN = "Player 2"
    }
    
    const firstT = currentTokenOneDiv.textContent;
    const secondT = currentTokenTwoDiv.textContent;

    return { firstN, secondN, firstT, secondT }
  };

  const startDiv = document.querySelector('.card');
  const startBoardDiv = document.querySelector('.board');

  const startGame = () => {
    startDiv.classList.add('hide');
    startBoardDiv.classList.remove('hide');
    ScreenController(getValues().firstN, getValues().secondN, getValues().firstT, getValues().secondT);
  }
  
  const startButtonDiv = document.querySelectorAll('.start-btn');
  startButtonDiv.forEach((e) => e.addEventListener('click', startGame));

}

StartController();

// ScreenController('Ivan', 'Nikita');

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
