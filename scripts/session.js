const { Level, MAX_LEVEL } = require('./level');

class Session {

  constructor(level=1) {
    this.id = 0;
    this.lastRequest = Date.now();
    this.currLevel = level;
    this.progress = [...Array(MAX_LEVEL).keys()].map(i => new Level(i + 1));
  }

  getLevelInfo() {
    this.lastRequest = Date.now();

    return this.progress[this.currLevel - 1].getInfo();
  }

  beginLevel() {
    this.lastRequest = Date.now();

    this.progress[this.currLevel - 1].begin();
  }

  handleAttempt(att) {
    this.lastRequest = Date.now();

    return this.progress[this.currLevel - 1].handleAttempt(att);
  }
}

module.exports = Session;
