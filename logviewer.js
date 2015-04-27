var fs = require('fs'),
    util = require('util');

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
  });
}

function poll(file) {
  fs.stat(file, function(error, stats) {
    var currentSize = stats.size;
    var delta = currentSize - lastSize;
    lastSize = currentSize;
    console.log("File has additional " + delta + " bytes");
  });
}


init(file);

setInterval(poll, 5000, file);
