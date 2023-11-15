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
  ]

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
      activePlayer.value.push(index);

      switchPlayerTurn();
      printNewRound();
    }
  }

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard
  };
}

function ScreenController() {
  const game = GameController();
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

  function clickHandlerButton(e) {
    const selectButton = e.target.id;

    game.playRound(selectButton);
    updateScreen();
  }

  updateScreen();
}

ScreenController();


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
