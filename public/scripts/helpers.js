
function formatTime(ms) {
  let millis = Math.floor(ms % 1000 / 10);
  let seconds = Math.floor(ms / 1000) % 60;
  let minutes = Math.floor(ms / (1000 * 60));

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${millis.toString().padStart(2, '0')}`;
}

module.exports = { formatTime };
