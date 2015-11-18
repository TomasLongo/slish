

module.exports = function() {}

module.exports.prototype.consume = function(data) {
  process.stdin.write(data);
}
