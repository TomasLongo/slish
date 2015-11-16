var chalk = require("chalk");

module.exports = function() {
    this.consume = function(data) {
      this._readLines(data, function(line) {

        var chalked = false;
        for (var i = 0; i < this.activePattern.chalks.length; i++) {
          var chalk = this.activePattern.chalks[i];
          if (line.indexOf(chalk.pattern) > -1) {
            process.stdout.write(chalk.chalk(line));
            chalked = true;
            break;
          }
        }

        if (chalked === false) {
          process.stdout.write(line);
        }
      });
    };

    this.patterns = [];

    this.patterns['JLevels'] =
      {
        id : "JLevels",
        description : "Colored patterns for the well known java log format containing the level like [INFO], [WARNING], ...",
        chalks : [
          {
            pattern : "[ERROR]",
            chalk : chalk.red
          },
          {
            pattern : "[WARNING]",
            chalk : chalk.yellow
          },
          {
            pattern : "[INFO]",
            chalk : chalk.green
          }
        ],
      };

    activePattern = this.patterns['JLevels'];

    this.setActivePattern = function(name) {
      activePattern = this.patterns[name];
    }

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
