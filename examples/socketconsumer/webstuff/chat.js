$(document).ready(function() {
  var socket = io('http://localhost:3300/winston.log');

  var logwindow = $('#logwindow');

  socket.on("newContent", function(message) {
    var span = $("<span></span>");
    span.html(message);
    logwindow.append('</br>').append(span);
    console.log("top " + logwindow.height());
    var spans = $('#logwindow span');
    var height =  $(spans[0]).height();
    console.log("Spanheight: " + height + ". Span count: " + spans.length);
    logwindow.animate({scrollTop: spans.length * height}, '200',  'swing', function() {
        console.log("Finished animating");
    });
  });
});
