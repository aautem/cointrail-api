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
    this._startNewGame(player1, player2);
  }

  _initializeSeriesPlayers(player1, player2) {
    const player1Color = player1.settings.color;
    const player2Color = player2.settings.color === player1Color ? player2.settings.altColor : player2.settings.color;
    player1.gamePieceColor = player1Color;
    player2.gamePieceColor = player2Color;

    const players = {};
    const p1 = new Player(player1);
    const p2 = new Player(player2);
    p1.initializeSeriesPlayer();
    p2.initializeSeriesPlayer();

    players[player1.username] = p1;
    players[player2.username] = p2;
    this.players = players;
  }

  _startNewGame(player1, player2) {
    const settings = {
      boardSize: this.boardSize,
      timeLimit: this.timeLimit,
      roomName: this.roomName,
    };
    const game = new Game(settings);
    game.initializeGame(player1, player2);
    this.games.push(game);
  }

  addGameWinner(username) {
    //
  }

  checkForSeriesWinner() {
    //
  }
}

module.exports = Series;