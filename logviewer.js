var fs = require('fs');

var i = 0;
fs.watch("tests/testfile.log", function(event, filename) {
  console.log("changed file " + filename + " with event " + event + i++);
});
