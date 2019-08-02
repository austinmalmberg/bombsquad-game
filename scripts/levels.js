const { formatTime } = require('./../public/scripts/helpers');

class Level {
  constructor(level) {
    this.no = level;
    this.time = Math.floor(20 / level) * 20 * 1000;
    this.attempts = Math.floor(20 / level) * 3;
  }

  getParams() {
    return {
      no: this.no,
      time: this.time,
      attempts: this.attempts,
      briefing: this.toString()
    };
  }

  toString() {
    return `Level ${this.no}:
    You have ${formatTime(this.time)} seconds and ${this.attempts} attempt(s) to diffuse the bomb!`
  }
}

let levels = [...Array(20).keys()].map(i => new Level(i));

function getLevelParams(level) {
  return levels[level].getParams();
}

module.exports = { getLevelParams };
