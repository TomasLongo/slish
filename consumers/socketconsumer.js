/**
 * Streams content to a socket.
 *
 * The socket will never receive data from the client. Instead,
 * it will just stream new log data down to the client.
 *
 * @param socket The socket to stream the content to
 */
var SocketConsumer = function(socket, eventToEmit) {
  console.log('Creating new socketconsumer. Will emit event %s', eventToEmit);
  this.socket = socket;
  this.event = eventToEmit;
}

var proto = SocketConsumer.prototype;

proto.consume = function(data) {
  console.log('Emitting new content to client');
  this.socket.emit(this.event, data);
}

module.exports = SocketConsumer;
