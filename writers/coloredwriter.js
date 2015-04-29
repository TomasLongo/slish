var chalk = require("chalk");

module.exports = function() {
    this.consume = function(data) {
      this._readLines(data, function(line) {
        if (line.indexOf("[ERROR]") > -1) {
          process.stdin.write(chalk.red(line))
        } else if (line.indexOf("[INFO]") > -1) {
          process.stdin.write(chalk.green(line));
        } else if (line.indexOf("[WARNING]") > -1) {
          process.stdin.write(chalk.yellow(line));
        } else {
          process.stdin.write(line);
        }
      });

    };

    /*
      Reads a string line by line

      params:
        string The string to read
        callback function(line)
    */
    this._readLines = function(string, callback) {
      var start = 0;
      for (i = 0; i < string.length; i++) {
        if (string.charAt(i) == "\n" || i == string.length - 1) {
          callback(string.slice(start, (i == string.length-1) ? ++i : i));
          start = i;
        }
      }
    };
}
