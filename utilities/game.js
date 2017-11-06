//   players: OBJECT
//   boardSize: NUMBER
//   turn?: STRING
//   board: ARRAY [[ STRING ]]
//   boardPoints: ARRAY [[ NUMBER ]]
//   timeLimit: BOOLEAN
//   gameOver: BOOLEAN
//   winner?: STRING
//   draw: BOOLEAN
//   winByPoints: BOOLEAN

const Player = require('./player');

export default class Game {
  constructor(props) {
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
  }

  public initializeGame(player1, player2) {
    this.initializeBoard();
    this.initializeBoardPoints();
    this.initializePlayers(player1, player2);
  }

  private pointValues() {
    return [5, 10, 15, 25, 35, 50];
  }

  private pointsPerBoard() {
    return {
      // 4x4 -- 16 spaces
      4: [4, 4, 4, 2, 1, 1],
      // 5x5 -- 25 spaces
      5: [6, 6, 6, 4, 2, 1],
      // 6x6 -- 36 spaces
      6: [10, 8, 8, 6, 2, 2],
    };
  }

  private initializeBoard() {
    const board = [];
    for (let rowId = 0; rowId < this.boardSize; rowId ++) {
      board[rowId] = [];
      for (let colId = 0; colId < this.boardSize; colId ++) {
        board[rowId][colId] = '';
      }
    }
    this.board = board;
  }

  private initializeBoardPoints() {
    const boardPoints = [];
    let pointValues = this.pointValues();
    let pointsPerBoard = this.pointsPerBoard();
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

  private initializePlayers(player1, player2) {
    const players = {};
    players[player1.username] = new Player(player1);
    players[player2.username] = new Player(player2);
    this.players = players;
    this.turn = player1.username;
  }

  public dropCoin(username, colId) {
    const rowId = this.findEmptyRowId(colId);

    if (rowId !== null) {
      const points = this.getBoardPoints(rowId, colId);
      this.players[username].redeemPoints(points);
      this.addPlayerToBoard(username, rowId, colId);

      const winner = this.getGameWinner();
      if (winner) {
        this.turn = null;
        this.winner = winner;
        this.gameOver = true;

        // DO SOMETHING WITH SERIES INSTANCE???

      } else {
        const draw = this.checkForDraw();
        if (draw) {
          const winnerByPoints = this.getWinnerByPoints();
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

  private findEmptyRowId(colId) {
    let emptyRowId = null;
    for (let rowId = this.boardSize - 1; rowId >= 0; rowId --) {
      if (emptyRowId === null && !this.board[rowId][colId]) {
        emptyRowId = rowId;
      }
    }
    return emptyRowId;
  }

  private addPlayerToBoard(username, rowId, colId) {
    this.board[rowId][colId] = username;
  }

  private getBoardPoints(rowId, colId) {
    return this.boardPoints[rowId][colId];
  }

  private getGameWinner() {
    const rows = this.board.slice();
    const columns = this.getWinningColumns();
    const diagonals = this.getWinningDiagonals();
    return this.checkWinningLines([...rows, ...columns, ...diagonals]);
  }

  private checkWinningLines(winningLines) {
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

  private getWinningRows() {
    let rows = [];
    this.board.forEach((row) => {
      rows.push(row);
    });
    return rows;
  }

  private getWinningColumns() {
    let columns = [];
    for (let colId = 0; colId < this.boardSize; colId ++) {
      columns[colId] = [];
      this.board.forEach((row) => {
        columns[colId].push(row[colId]);
      });
    }
    return columns;
  }

  private getWinningDiagonals() {
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

  private checkForDraw() {
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

  private getWinnerByPoints() {
    const players = Object.keys(this.players);
    const player1 = this.players[players[0]];
    const player2 = this.players[players[1]];
    if (player1.points === player2.points) {
      return null;
    }
    return player1.points > player2.points ? player1.username : player2.username;
  }
}