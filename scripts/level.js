const { formatTime } = require('./../public/scripts/helpers');
const Bomb = require('./bomb');

const MAX_LEVEL = 20;

class Level {

  constructor(level) {
    this.no = level;
    this.timeToDiffuse = Math.floor(MAX_LEVEL / level) * 20 * 1000; // in ms
    this.attempts = Math.floor(MAX_LEVEL / level) * 3;
  }

  begin() {
    if (!this.bomb)
      this.bomb = new Bomb(this.timeToDiffuse, this.attempts);
  }

  handleAttempt(att) {

    if (this.bomb)
      this.bomb.handleAttempt(att);
  }

  getInfo() {
    let info = {
      no: this.no,
      timeToDiffuse: this.timeToDiffuse,
      attempts: this.attempts,
      briefing: `Level ${this.no}:
      You have ${formatTime(this.timeToDiffuse)} seconds and ${this.attempts} attempt(s) to diffuse the bomb!`
    };

    if (this.bomb)
      info.bomb = this.bomb.getInfo();

    return info;
  }
}

module.exports = { Level, MAX_LEVEL };
