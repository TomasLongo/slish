var fs = require('fs'),
    util = require('util'),
    minimist = require('minimist'),
    logger = require('BleedingTea');

/**
  In this first version we will poll the file every x millis.

  Funktionsweise:
  In der ersten Iteration schauen wir uns die letzten x bytes des Files an und
  suchen dort das erste '\n'-Zeichen. Von dort an, geben wir die restlichen Bytes
  zeilenweise aus.

  Die weiteren Iteration bestehen aus dem Ermitteln der Differenz der Filegröße
  zwischen der aktuellen und der letzten Iteration.
*/

var args = minimist(process.argv.slice(2));

if (args._.length == 0) {
  console.log("No file provided");
  console.log("Usage; logviewer fileToPoll [-i]")
  process.exit(1);
}

logger.active = args.v ? true : false;

var file = args._[0];
logger.info("Polling file " + file);

var initialBytesToRead = 500;
var lastSize = 0;

/*
  Ermittle die initiale Größe des Files. U.u. ist es noch leer oder hat noch nicht
  viel Inhalt. In diesem Fall müssen wir initial nicht so viel lesen.
*/
function init(file) {
  fs.stat(file, function(error, stats) {
    if (error) {
      console.error(error.message);
      process.exit(1);
    }

    if (initialBytesToRead > stats.size) {
      initialBytesToRead = stats.size;
      lastSize = stats.size;
    }

    var buffer = new Buffer(initialBytesToRead);
    fs.open(file, "r", function(error, fd) {
      getLastLines(fd, stats.size, initialBytesToRead, function(error, lastLines) {
        console.log(lastLines);
      });
    });
  });
}

/**
  Checks for new content on a file and prints the new content to STDOUT

  params:
    file      The file to check for new content
    callback  function(error, content)
*/
function poll(file, callback) {
  fs.stat(file, function(error, stats) {
    var currentSize = stats.size;
    var delta = currentSize - lastSize;
    lastSize = currentSize;
    logger.info("File has additional " + delta + " bytes");

    var buffer = new Buffer(delta);
    if (delta > 0) {
      fs.open(file, "r", function(error, fd) {
        fs.read(fd, buffer, 0, delta, currentSize - delta, function(error, bRead, buffer) {
          logger.info("Read " + bRead + " bytes from " + file);
          var newContent = String(buffer);
          
          callback(error, newContent);
        });
      });
    }
  });
}

/**
  Returns the tail of a file denoted by fd.

  The tail is made up of the last **complete** lines that are found
  in the last byteToRead bytes.

  params:
    fd          The filedescriptor of the file
    fileSize    The size of the file
    tailSize    The supposed length of the file tail
    callback    function(error, tail)
*/
function getLastLines(fd, fileSize, tailSize, callback) {
  var buffer = new Buffer(tailSize);
  fs.read(fd, buffer, 0, tailSize, fileSize - tailSize, function(error, bRead, buffer) {
    var bufferString = String(buffer);
    var posToStartRead = -1;
    for (i = 0; i < bufferString.length; i++) {
      if (bufferString.charAt(i) == "\n") {
        posToStartRead = i;
        break;
      }
    }

    callback(null, bufferString.slice(posToStartRead+1, bufferString.length));
  });
}


var pollInterval = args.i ? args.i : 200;


init(file);

setInterval(poll,
  pollInterval,
  file,
  function(error, content) {process.stdin.write(content)});
