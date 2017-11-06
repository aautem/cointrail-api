//   players: OBJECT
//   boardSize: NUMBER
//   turn?: STRING
//   roomName: STRING
//   board: ARRAY [[ STRING ]]
//   boardPoints: ARRAY [[ NUMBER ]]
//   timeLimit: BOOLEAN
//   gameOver: BOOLEAN
//   winner?: STRING
//   draw: BOOLEAN
//   winByPoints: BOOLEAN

const Player = require('./player');

class Game {
  constructor(props) {
    if (!props.turn) {
      this.roomName = props.roomName;
      this.boardSize = props.boardSize;
      this.timeLimit = props.timeLimit;
      this.winner = null;
      this.draw = false;
      this.gameOver = false;
      this.winByPoints = false;

      // initialized later
      this.board = null;
      this.boardPoints = null;
      this.players = null;
      this.turn = null
    } else {
      this._createInGameInstance(props);
    }
  }

  initializeGame(player1, player2) {
    this._initializeBoard();
    this._initializeBoardPoints();
    this._initializePlayers(player1, player2);
  }

  _pointValues() {
    return [5, 10, 15, 25, 35, 50];
  }

  _pointsPerBoard() {
    return {
      // 4x4 -- 16 spaces
      4: [4, 4, 4, 2, 1, 1],
      // 5x5 -- 25 spaces
      5: [6, 6, 6, 4, 2, 1],
      // 6x6 -- 36 spaces
      6: [10, 8, 8, 6, 2, 2],
    };
  }

  _initializeBoard() {
    const board = [];
    for (let rowId = 0; rowId < this.boardSize; rowId ++) {
      board[rowId] = [];
      for (let colId = 0; colId < this.boardSize; colId ++) {
        board[rowId][colId] = '';
      }
    }
    this.board = board;
  }

  _initializeBoardPoints() {
    const boardPoints = [];
    let pointValues = this._pointValues();
    let pointsPerBoard = this._pointsPerBoard()[this.boardSize];
    for (let rowId = 0; rowId < this.boardSize; rowId ++) {
      boardPoints[rowId] = [];
      for (let colId = 0; colId < this.boardSize; colId ++) {
        let random = Math.floor(Math.random() * pointValues.length);
        boardPoints[rowId].push(pointValues[random]);
        pointsPerBoard[random] --;
        if (!pointsPerBoard[random]) {
          pointValues = pointValues.slice(0, random).concat(pointValues.slice(random + 1));
          pointsPerBoard = pointsPerBoard.slice(0, random).concat(pointsPerBoard.slice(random + 1));
        }
      }
    }
    this.boardPoints = boardPoints;
  }

  _initializePlayers(player1, player2) {
    const players = {};
    players[player1.username] = new Player(player1);
    players[player2.username] = new Player(player2);
    this.turn = player1.username;
    this.players = players;
  }

  dropCoin(username, colId) {
    const rowId = this._findEmptyRowId(colId);

    if (rowId !== null) {
      const points = this._getBoardPoints(rowId, colId);
      this.players[username].redeemPoints(points);
      this._addPlayerToBoard(username, rowId, colId);

      const winner = this._getGameWinner();
      if (winner) {
        this.turn = null;
        this.winner = winner;
        this.gameOver = true;
      } else {
        const draw = this._checkForDraw();
        if (draw) {
          const winnerByPoints = this._getWinnerByPoints();
          if (winnerByPoints) {
            this.turn = null;
            this.winner = winnerByPoints;
            this.winnerByPoints = true;
            this.gameOver = true;
          } else {
            this.turn = null;
            this.draw = true;
            this.gameOver = true;
          }
        } else {
          const nextPlayer = Object.keys(this.players).filter((player) => {
            return player.username !== this.turn;
          });
          this.turn = nextPlayer[0];
        }
      }
    }
  }

  _findEmptyRowId(colId) {
    let emptyRowId = null;
    for (let rowId = this.boardSize - 1; rowId >= 0; rowId --) {
      if (emptyRowId === null && !this.board[rowId][colId]) {
        emptyRowId = rowId;
      }
    }
    return emptyRowId;
  }

  _addPlayerToBoard(username, rowId, colId) {
    this.board[rowId][colId] = username;
  }

  _getBoardPoints(rowId, colId) {
    return this.boardPoints[rowId][colId];
  }

  _getGameWinner() {
    const rows = this.board.slice();
    const columns = this._getWinningColumns();
    const diagonals = this._getWinningDiagonals();
    return this._checkWinningLines([...rows, ...columns, ...diagonals]);
  }

  _checkWinningLines(winningLines) {
    let winner = null;
    winningLines.forEach((line) => {
      if (!winner) {
        let winningPlayer = line.reduce((prevPlayer, nextPlayer) => {
          if (prevPlayer && nextPlayer === prevPlayer) {
            return prevPlayer;
          }
          return null;
        });
        if (winningPlayer) {
          winner = winningPlayer;
        }
      }
    });
    return winner;
  }

  _getWinningColumns() {
    let columns = [];
    for (let colId = 0; colId < this.boardSize; colId ++) {
      columns[colId] = [];
      this.board.forEach((row) => {
        columns[colId].push(row[colId]);
      });
    }
    return columns;
  }

  _getWinningDiagonals() {
    const topToBot = [];
    const botToTop = [];
    let colId = this.boardSize - 1;
    for (let rowId = 0; rowId < this.boardSize; rowId ++) {
      // top left --> bot right: [0, 0], [1, 1], [2, 2], [3, 3]
      topToBot.push(this.board[rowId][rowId]);
      // bot left --> top right: [0, 3], [1, 2], [2, 1], [3, 0]
      botToTop.push(this.board[rowId][colId --]);
    }
    return [topToBot, botToTop];
  }

  _checkForDraw() {
    let draw = true;
    this.board.forEach((row, rowId) => {
      if (draw) {
        row.forEach((col, colId) => {
          if (!this.board[rowId][colId]) {
            draw = false;
          }
        });
      }
    });
    return draw;
  }

  _getWinnerByPoints() {
    const players = Object.keys(this.players);
    const player1 = this.players[players[0]];
    const player2 = this.players[players[1]];
    if (player1.points === player2.points) {
      return null;
    }
    return player1.points > player2.points ? player1.username : player2.username;
  }

  _createInGameInstance(props) {
    this.roomName = props.roomName;
    this.boardSize = props.boardSize;
    this.timeLimit = props.timeLimit;
    this.winner = props.winner;
    this.draw = props.draw;
    this.gameOver = props.gameOver;
    this.winByPoints = props.winByPoints;
    this.board = props.board;
    this.boardPoints = props.boardPoints;
    this.players = props.players;
    this.turn = props.turn;
  }
}

module.exports = Game;