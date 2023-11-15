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
          token: "X"
      },
      {
          name: playerTwoName,
          token: "0"
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
      board.dropToken(index, getActivePlayer().token);

      const playerValue = board.getBoard();
      if (playerValue[index][0].getValue() === getActivePlayer().token) {
          switchPlayerTurn();
          printNewRound();
      } else {
          printNewRound();
      }
  }

  printNewRound();

  return {
      playRound,
      getActivePlayer
  };
}

const game = GameController();