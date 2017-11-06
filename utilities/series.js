//   players: OBJECT
//   seriesLength: NUMBER
//   boardSize: NUMBER
//   timeLimit: BOOLEAN
//   gamesPlayed: NUMBER
//   games: ARRAY [ OBJECT ]
//   winner: BOOLEAN
//   draw: BOOLEAN
//   seriesOver: BOOLEAN
//   winByPoints: BOOLEAN

const Player = require('./player');
const Game = require('./game');

export default class Series {
  constructor(props) {
    this.seriesLength = props.seriesLength;
    this.boardSize = props.boardSize;
    this.timeLimit = props.timeLimit;
    this.gamesPlayed = 0;
    this.games = [];
    this.winner = null;
    this.draw = false;
    this.seriesOver = null;
    this.winByPoints = false;

    // initialized later
    this.players = null;
  }

  public initializeSeries(player1, player2) {
    this.initializeSeriesPlayers(player1, player2);
  }

  private initializeSeriesPlayers(player1, player2) {
    const player1Color = player1.settings.color;
    const player2Color = player2.settings.color === player1Color ? player2.settings.color : player2.settings.altColor;
    player1.gamePieceColor = player1Color;
    player2.gamePieceColor = player2Color;

    const players = {};
    players[player1.username] = new Player(player1).initializeSeriesPlayer();
    players[player2.username] = new Player(player2).initializeSeriesPlayer();
    this.players = players;
  }

  public startNewGame() {
    // CHECK IF SERIES IS OVER???

    const settings = {
      boardSize: this.boardSize,
      timeLimit: this.timeLimit,
    };
    this.games.push(new Game(settings));
  }

  public addGameWinner(username) {
    //
  }

  public checkForSeriesWinner() {
    //
  }
}











export function initializeBoard(size) {
  return function(dispatch, getState) {
    const gameboard = createBoard(size);
    const boardPoints = createBoardPoints(size);
    dispatch(setBoard(gameboard));
    dispatch(setBoardPoints(boardPoints));
  }
}

export function dropCoin(colId, playerId) {
  return function(dispatch, getState) {
    const rowId = util.findEmptyRowId(getState().game.board, colId);

    if (typeof rowId === 'number') {
      dispatch(toggleTurn());
      dispatch(updateBoard({ rowId, colId, playerId }));
      dispatch(collectPoints({ rowId, colId, playerId }));

      const winner = util.getWinner(getState().game.board);

      if (winner) {
        dispatch(declareWinner(winner));

        // game over modal
        // 'results' button to check series overview
        // countdown to next round
        // 'next' button to start next round

        // add results to series history // dispatch(series.postResults(gameData))
        // reset score
        // reset gameboard
        // reset gameboard points

      } else {
        const tie = util.checkForTie(getState().game.board);

        if (tie) {
          const players = getState().game.players;
          const playerIds = Object.keys(players);
          const winner = getWinnerByPoints(players[playerIds[0]], players[playerIds[1]]);

          if (winner) {
            dispatch(declareWinner(winner));
          } else {
            // endGameInDraw();
          }
        }
      }
    } else {
      dispatch(coinDropError());
    }
  }
}

function createBoard(size) {
  const gameboard = [];
  for (let rowId = 0; rowId < size; rowId ++) {
    gameboard[rowId] = [];
    for (colId = 0; colId < size; colId ++) {
      gameboard[rowId][colId] = 0;
    }
  }
  return gameboard;
}

function createBoardPoints(size) {
  const boardPoints = [];
  let points = POINTS.slice();
  let pointCounts = POINT_COUNTS[size].slice();
  for (let rowId = 0; rowId < size; rowId ++) {
    boardPoints[rowId] = [];
    for (let colId = 0; colId < size; colId ++) {
      let i = Math.floor(Math.random() * points.length);
      boardPoints[rowId].push(points[i]);
      pointCounts[i] --;
      if (!pointCounts[i]) {
        points = points.slice(0, i).concat(points.slice(i + 1));
        pointCounts = pointCounts.slice(0, i).concat(pointCounts.slice(i + 1));
      }
    }
  }
  return boardPoints;
}



export function findEmptyRowId(board, colId) {
  let emptyRowId = null;
  for (let rowId = board.length - 1; rowId >= 0; rowId --) {
    if (typeof emptyRowId !== 'number' && board[rowId][colId] === 0) {
      emptyRowId = rowId;
    }
  }
  return emptyRowId;
}

export function getWinner(board) {
  const wRows = getWinningRows(board);
  const wColumns = getWinningColumns(board);
  const wDiagonals = getWinningDiagonals(board);
  const wOptions = [...wRows, ...wColumns, ...wDiagonals];
  return checkForWinner(wOptions);
}

export function checkForTie(board) {
  let tie = true;
  board.forEach((row, rowId) => {
    if (tie) {
      row.forEach((col, colId) => {
        if (board[rowId][colId] === 0) {
          tie = false;
        }
      });
    }
  });
  return tie;
}

export function getWinnerByPoints(p1, p2) {
  if (p1.score > p2.score) {
    return p1.id;
  } else if (p1.score < p2.score) {
    return p2.id;
  }
  return null;
}

function getWinPossibilities(board) {
  const rows = getBoardRows(board);
  const columns = getBoardColumns(board);
  const diagonals = getBoardDiagonals(board);
  return [ ...rows, ...columns, ...diagonals];
}

function getWinningRows(board) {
  let rows = [];
  board.forEach((row) => {
    rows.push(row);
  });
  return rows;
}

function getWinningColumns(board) {
  let columns = [];
  for (let colId = 0; colId < board.length; colId ++) {
    columns[colId] = [];
    board.forEach((row) => {
      columns[colId].push(row[colId]);
    });
  }
  return columns;
}

function getWinningDiagonals(board) {
  let diagonals = [[], []];
  let colId = board.length - 1;
  for (let rowId = 0; rowId < board.length; rowId ++) {
    // top right diag: [row, row], [row, row] ...
    diagonals[0].push(board[rowId][rowId]);
    // bot left diag: [row, size - 1], [row, size - 2] ...
    diagonals[1].push(board[rowId][colId --]);
  }
  return diagonals;
}

function checkForWinner(winOptions) {
  let winner = null;

  winOptions.forEach((option) => {
    const winningPlayer = option.reduce((prevPlayer, nextPlayer) => {
      if (prevPlayer && nextPlayer === prevPlayer) {
        return prevPlayer;
      }
      return null;
    });
    if (winningPlayer) {
      winner = winningPlayer;
    }
  });

  return winner;
}
