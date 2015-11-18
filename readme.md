# Slish - Realtime Streaming of File Content

Slish takes new content of a file as soon as it arrives and is able to distribute it to multiple consumers.

Consumers can be the console or a database, a remote service or simply another file.

Consumer must conform to a simple interface and provide a method `consume` that takes in the file content that will be provided by Slish. The stage is yours from that point on.

### Features
* Easy to use API. Start to stream is a matter of creating a Slish instance and call `startStreaming` on it.
* Easily. Slish makes it easy to create custom consumers. Just provide an object with a method `consume(newData)` where `newData` is the new file content detected by Slish and you're ready to go.
* Ships with three ready to use consumers
  * ConsoleConsumer: Simply pass new content to stdout
  * ColoredConsumer: Colors new content line-by-line based on configured patterns

### Consumers
The `consumers` folder contains a separate `package.json` file to manage the dependencies of the consumers.

### Working Example (taken from the examples folder)
~~~js
/**
  Showcases how to use Slish to observe a file.
 */
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

~~~
