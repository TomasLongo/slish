/**
  Showcases how to use Slish to observe a file.

  Start with `node slishtest.js <fileToObserve>` where 'fileToObserve' is an absolute path to a text file.
 */

if (process.argv.length !== 3) {
  console.log('Usage: node slishtest.js <fileToObserve>');
  process.exit(-1);
}

var Slish = require('slish');
var ConsoleWriter = require('consumers/consoleconsumer');
var ColoredWriter = require('consumers/coloredconsumer')
var path = require('path');

var slish = new Slish(process.argv[2]);
var consumer = new ColoredWriter();

// The pattern is built in Slish and can be accesed by name
consumer.setActivePattern('Winston');

// Adds the colored to the output channels
slish.addConsumer(consumer);

console.log('start streaming');

// Starts obserrving the file
slish.startStreaming();
