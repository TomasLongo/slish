var fs = require('fs');
var Path = require('path');
/**
 * Constructor for the log streamer
 *
 * @param     fileToObserve The absolute path to the file which should be observed
 *
 * @param     options       An object containing different optional config options
 *                          - pollIntervall: An integer denoting the intercall in milliseconds
 *                            at which the file should be polled
 *                          - streamTail: A flag indicating if the tail should be initially streamed
 *                          - initialBytesToRead: The size of the tail that should be initially streamed.
 *                            Only effective if `streamTail` is set to true.
 */
var LogStreamer = module.exports = function(fileToObserve, options)  {
  options = options || {};

  this.writers = [];
  this.pollInterval = options.pollInterval || 50;
  this.fileToObserve = fileToObserve;
  this.initialBytesToRead = options.initialBytesToRead || 500;
  this.lastSize = 0;

  this.streamTail = options.streamTail || true;

  this._init();
}

var proto = LogStreamer.prototype;

proto.startStreaming = function() {
  var self = this;
  this.intervalHandler = setInterval(function() { self._poll() }, self.pollInterval);
}

proto.stopStreaming = function() {
  clearInterval(this.intervalHandler);
}

proto.addWriter = function(writer) {
  this.writers.push(writer);
}

/**
 * Sets the freqeuncy at which the file is polled to check for
 * new data.
 */
proto.setInterval = function(interval) {
  this.pollInterval = interval;
}

/**
 * Streams data to all registered consumers
 */
proto._stream = function(data) {
  this.writers.forEach(function(writer) {
    writer.consume(data);
  });
}

/**
 * Inits the state of the streamer by reading
 * the file to observe.
 */
proto._init = function() {
  var self = this;
  console.log('Initialising for %s', self.fileToObserve);
  fs.stat(self.fileToObserve, function(error, stats) {
    if (error) {
      console.error(error.message);
      process.exit(1);
    }

    if (self.initialBytesToRead > stats.size) {
      self.initialBytesToRead = stats.size;
      self.lastSize = stats.size;
    }

    if (self.initialBytesToRead == 0) {
      return;
    }

    if (!self.streamTail) {
      return;
    }

    var buffer = new Buffer(self.initialBytesToRead);
    fs.open(self.fileToObserve, "r", function(error, fd) {
      self._getLastLines(fd, stats.size, self.initialBytesToRead, function(error, lastLines) {
        self._stream(lastLines);
      });
    });
  });
}

/**
 * Checks the file to observe for new content.
 */
proto._poll = function() {
  var self = this;
  fs.stat(self.fileToObserve, function(error, stats) {
    var currentSize = stats.size;
    var delta = currentSize - self.lastSize;
    self.lastSize = currentSize;

    if (delta > 0) {
      var buffer = new Buffer(delta);
      fs.open(self.fileToObserve, "r", function(error, fd) {
        fs.read(fd, buffer, 0, delta, currentSize - delta - 1, function(error, bRead, buffer) {
          var newContent = String(buffer);
          self._stream(newContent);
        });
      });
    }
  });
}

/**
 * Fetches the tail of the file denoted by the passed file descriptor.
 * that fits into `tailSize` bytes.
 *
 * The tail is passed to callback.
 *
 * @param fd        The file descriptor for the file of interest
 * @param fileSize  The size of the file denoted by `fd`
 * @param tailSize  The size of the tail that should be fetched
 * @param callback  Function that gets the tail
 *                  `callback(error, tail)`
 */
proto._getLastLines = function(fd, fileSize, tailSize, callback) {
  var buffer = new Buffer(tailSize);

  // This reads the last bytes of the file
  // `fileSize - tailSize` determines the position at which to start reading
  fs.read(fd, buffer, 0, tailSize, fileSize - tailSize, function(error, bRead, buffer) {
    if (error) {
      return callback(error);
    }

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
