// GAME PLAYER
// id: NUMBER
// username: STRING
// avatarUrl: STRING
// gamePieceColor: STRING
// points: NUMBER
// winner: BOOLEAN

// SERIES PLAYER EXTENDS GAME PLAYER
// wins: NUMBER
// losses: NUMBER
// draws: NUMBER

class Player {
  constructor(props) {
    this.id = props.id;
    this.username = props.username;
    this.avatarUrl = props.avatarUrl;
    this.gamePieceColor = props.gamePieceColor;
    this.points = 0;
    this.winner = false;
  }

  initializeSeriesPlayer() {
    this.wins = 0;
    this.losses = 0;
    this.draws = 0;
  }

  redeemPoints(points) {
    this.points += points;
  }
}

module.exports = Player;