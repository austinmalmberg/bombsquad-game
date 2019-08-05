
class Bomb {

  constructor(timeToDiffuse, attemptsRemaining) {
    this.state = 'running';
    this.detonationTime = Date.now() + timeToDiffuse;
    this.attemptsRemaining = attemptsRemaining;
    this.code = "1234";
    this.attempts = [];
  }

  /**
   * Return status of the bomb.
   *
   * 'diffused' if the correct code is entered
   * 'exploded' if attemptsRemaining <= 0
   *
  */
  handleAttempt(att) {
    this.attempts.push(att);

    if (att.time >= this.detonationTime) {
      this.explode();
      return;
    }

    --this.attemptsRemaining;

    if (this.code === att.code)
      this.diffuse();
    else if (this.attemptsRemaining <= 0)
      this.explode();
    else
      this.hints = createHints(this.code, att.code);
  }

  diffuse() {
    this.state = 'diffused';
    this.diffusedTime = Date.now();
  }

  explode() {
    this.state = 'exploded';
  }

  getInfo() {
    let info = {
      state: this.state,
      detonationTime: this.detonationTime,
      attemptsRemaining: this.attemptsRemaining
    }

    if (this.hints)
      info.hints = this.hints;

    return info;
  }
}

/**
 * Compares two strings and returns a 2D array as follows
 * [
 *   [ characters from other that are in the correct position ],
 *   [ characters from other that are in the code, but in an incorrect position ]
 * ]
 */
function createHints(orig, other) {

  let inPosition = [];
  let inCode = [];

  for (let i = 0; i < other.length; i++) {
    let ch = other.charAt(i);
    let origIndex = orig.indexOf(ch);

    if (origIndex == i)
      inPosition.push(ch);
    else if (origIndex >= 0)
      inCode.push(ch);
  }

  return [ inPosition, inCode];
}

module.exports = Bomb;
