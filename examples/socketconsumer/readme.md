# SocketConsumer Example

Demonstrates the use of the socket consumer in order to receive updates of observed files from remote location.

This examples consists of two parts:
1. The server that hosts a tiny web app that will observe a file and send its new content to every client that connects to it
2. The `realtimelogging.js` script that writes formatted logs to a file periodically

You have to start both the server, as well as the logging script providing the file to observe (obviously it has to be same file in both cases ;D)

`node socket-server.js <fileToObserve>`

`node realtimelogging.js <fileToObserve>`
