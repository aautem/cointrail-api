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

class Series {
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
    this.roomName = null;
  }

  initializeSeries(player1, player2) {
    this.roomName = `${player1.username}-vs-${player2.username}`;
    this._initializeSeriesPlayers(player1, player2);
  }

  _initializeSeriesPlayers(player1, player2) {
    const player1Color = player1.settings.color;
    const player2Color = player2.settings.color === player1Color ? player2.settings.color : player2.settings.altColor;
    player1.gamePieceColor = player1Color;
    player2.gamePieceColor = player2Color;

    const players = {};
    players[player1.username] = new Player(player1).initializeSeriesPlayer();
    players[player2.username] = new Player(player2).initializeSeriesPlayer();
    this.players = players;
  }

  startNewGame() {
    const settings = {
      boardSize: this.boardSize,
      timeLimit: this.timeLimit,
      roomName: this.roomName,
    };
    this.games.push(new Game(settings));
  }

  addGameWinner(username) {
    //
  }

  checkForSeriesWinner() {
    //
  }
}

module.exports = Series;