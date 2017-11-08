  // players: OBJECT
  // seriesLength: NUMBER
  // boardSize: NUMBER
  // timeLimit: BOOLEAN
  // gamesPlayed: NUMBER
  // games: ARRAY [ OBJECT ]
  // winner: BOOLEAN
  // draw: BOOLEAN
  // seriesOver: BOOLEAN
  // winByPoints: BOOLEAN

const Player = require('./player');
const Game = require('./game');

class Series {
  constructor(props) {
    if (!props.roomName) {
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
    } else {
      this._createInSeriesInstance(props);
    }
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

  _createInSeriesInstance(props) {
    this.seriesLength = props.seriesLength;
    this.boardSize = props.boardSize;
    this.timeLimit = props.timeLimit;
    this.gamesPlayed = props.gamesPlayed;
    this.games = props.games;
    this.winner = props.winner;
    this.draw = props.draw;
    this.seriesOver = props.seriesOver;
    this.winByPoints = props.winByPoints;
    this.players = props.players;
    this.roomName = props.roomName;
  }

  updateSeries() {
    // add stats from last game to series stats and seriesPlayers
    const game = this.games[this.gamesPlayed];
    const usernames = this._getUsernames();

    // update game count and series player W/L/D/points
    this.gamesPlayed += 1;
    this.players[usernames[0]].points += game.players[usernames[0]].points;
    this.players[usernames[1]].points += game.players[usernames[1]].points;

    if (game.winner) {
      const loser = game.winner === usernames[0] ? usernames[1] : usernames[0];
      console.log('*** LOSER ***', loser);
      this.players[game.winner].wins += 1;
      this.players[loser].losses += 1;
    } else if (game.draw) {
      this.players[usernames[0]].draws += 1;
      this.players[usernames[1]].draws += 1;
    }

    // check for series winner
    if (this._seriesClosedOut()) {
      this.seriesOver = true;
      this.winner = this._determineSeriesWinner();
    } else {
      this._startNewGame(this.players[usernames[0]], this.players[usernames[1]]);
    }
  }

  _determineSeriesWinner() {
    const usernames = this._getUsernames();
    const p1 = this.players[usernames[0]];
    const p2 = this.players[usernames[1]];
    if (p1.wins === p2.wins) {
      if (p1.points === p2.points) {
        this.draw = true;
      } else {
        this.winner = p1.points > p2.points ? p1.username : p2.username;
        this.winByPoints = true;
      }
    } else {
      const winThreshold = this._getWinsNeededToClose();
      if (p1.wins >= winThreshold) {
        this.winner = p1.username;
      } else if (p2.wins >= winThreshold) {
        this.winner = p2.username;
      }
    }
  }

  _seriesClosedOut() {
    const winThreshold = this._getWinsNeededToClose();
    const usernames = this._getUsernames();
    const p1 = this.players[usernames[0]];
    const p2 = this.players[usernames[1]];
    if (p1.wins >= winThreshold || p2.wins >= winThreshold) {
      return true;
    }
    return false;
  }

  _getWinsNeededToClose() {
    if (this.seriesLength === 1) {
      return 1;
    }
    return (this.seriesLength / 2) + 1;
  }

  _getUsernames() {
    return Object.keys(this.players);
  }

  addGameWinner(username) {
    //
  }

  checkForSeriesWinner() {
    //
  }
}

module.exports = Series;