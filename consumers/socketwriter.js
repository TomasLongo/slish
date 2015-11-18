/**
 * Streams content to a socket.
 *
 * The socket will never receive data from the client. Instead,
 * it will just stream new log data down to the client.
 *
 * @param socket The socket to stream the content to
 */
var SocketWriter = function(socket, eventToEmit) {
  this.socket = socket;
  this.event = eventToEmit;
}

var proto = SocketWriter.prototype;

proto.consume = function(data) {
  this.socket.emit(this.eventToEmit, data);
}
