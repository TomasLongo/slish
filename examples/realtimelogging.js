/**
  Writes log messages to a file with winston every x seconds.
  Let Slish observe the log file to see the processing of new file
  content in real time.
 */

if (process.argv.length < 3) {
 console.log('Usage: node realtimelogging.js <fileToWriteTo> [intervallBetweenMessages]');
 process.exit(-1);
}

var Streamer = require('slish');
var ConsoleWriter = require('consumers/consoleconsumer');
var ColoredWriter = require('consumers/coloredconsumer');
var path = require('path');
var winston = require('winston');

/**
 * Redirect log to file
 */
winston.add(winston.transports.File,{
  name: "DEFAULT",
  json: false,
  level: 'info',
  filename: process.argv[2],
  timestamp: function() {
    return new Date(Date.now());
  },
  zippedArchive: true,
  maxsize: 10240000, //10MB
});

/**
 * Write logs via winston into file every x seconds to check if the coloredwriter
 * correctly colors the stuff written by winston.
 */

var messages = [
  function() { winston.info('This is an info')},
  function() { winston.error('This is an error')},
  function() { winston.warn('This is a warning')},
]

var index = 0;
setInterval(function() {
  messages[(index++) % messages.length]();
}, process.argv[3] || 2000);
