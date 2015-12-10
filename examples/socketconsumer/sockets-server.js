var Slish = require('slish');
var SocketConsumer = require('consumers/socketconsumer');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

/**
 * Minimalistic web app that showcases how the log of a web app can
 * be sent to remote clients in real time.
 *
 * Every client that connects to the channel will receive new content
 * of the observed file as it arrives.
 */

if (process.argv.length !== 3) {
  console.log("Usage: node socket.server.js <fileToObserve>");
  process.exit(-1);
}
var slish = new Slish(process.argv[2]);

app.use(express.static('./tests/webstuff'));


// Create channel where clients can connect to
var winstonChannel = io.of('/winston.log');

winstonChannel.on('connect', function(socket) {
  // Add a new socket consumer for every client that connects
  console.log('Adding new socketconsumer to slish. ID %s', socket.id);
  slish.addConsumer(new SocketConsumer(socket, 'newContent'));
});

app.get('/', function(req, res, next) {
  fs.readFile('./tests/webstuff/view.html', 'utf-8', function(error, data) {
    if (error) {
      res.status(404).send(error.message);
    } else {
      res.send(data);
    }
  });
});


http.listen(3300, function() {
  console.log('Express is up, ready and listening on port ', 3300);
  console.log('Observing file %s', process.argv[2]);
  console.log('Start the realtimelogging script and visit http://localhost:3300 to see how the logs arrive');
  slish.startStreaming();
});
