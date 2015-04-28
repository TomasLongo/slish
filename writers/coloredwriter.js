var chalk = require("chalk");

module.exports = function() {
    this.consume = function(data) {
      if (data.indexOf("[ERROR]") > -1) {
        process.stdin.write(chalk.red(data))
      } else if (data.indexOf("[INFO]") > -1) {
        process.stdin.write(chalk.green(data));
      } else if (data.indexOf("[WARNING]") > -1) {
        process.stdin.write(chalk.yellow(data));
      } else {
        process.stdin.write(data);
      }
    };
}
