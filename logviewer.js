var fs = require('fs'),
    util = require('util'),
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

var file = "tests/testfile.log";

var initialBytesToRead = 500;
var bytesToRead = initialBytesToRead;
var lastSize = 0;

var lastPosition = 0;

logger.active = false;

/*
  Ermittle die initiale Größe des Files. U.u. ist es noch leer oder hat noch nicht
  viel Inhalt. In diesem Fall müssen wir initial nicht so viel lesen.
*/
function init(file) {
  fs.stat(file, function(error, stats) {
    if (initialBytesToRead > stats.size) {
      initialBytesToRead = stats.size;
      lastSize = stats.size;
    }

    var buffer = new Buffer(initialBytesToRead);
    fs.open(file, "r", function(error, fd) {
      getLastLines(fd, stats.size, initialBytesToRead, function(error, lastLines) {
        console.log(lastLines);
      });

      // fs.read(fd, buffer, 0, initialBytesToRead, stats.size - initialBytesToRead, function(error, bRead, buffer) {
      //   logger.info("Read " + bRead + " bytes from " + file);
      //   console.log(String(buffer));
      // });
    });
  });
}

/**
  Checks for new content on a file and prints the new content to STDOUT

  params:
    file The file to check for new content
*/
function poll(file) {
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
          var toAppend = String(buffer);
          console.log(toAppend.slice(0, toAppend.length-1));
        });
      });
    }
  });
}

/**
  Returns the last lines of a file denoted by fd.

  params:
    fd          The filedescriptor of the file
    fileSize    The size of the file
    byteToRead  The length of the file tail
    callback    function(error, lastLines)
*/
function getLastLines(fd, fileSize, bytesToRead, callback) {
  var buffer = new Buffer(bytesToRead);
  fs.read(fd, buffer, 0, bytesToRead, fileSize - bytesToRead, function(error, bRead, buffer) {
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



init(file);

setInterval(poll, 2000, file);
