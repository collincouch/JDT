(function($) {
  $.fn.stopwatch = function(theme) {
    var stopwatch = $(this);
    stopwatch.addClass('stopwatch').addClass(theme);

    stopwatch.each(function() {
      var instance = $(this);
      var timer = 0;

      var stopwatchFace = $('<div>').addClass('the-time');
      var timeHour = $('<span>').addClass('hr').text('00');
      var timeMin = $('<span>').addClass('min').text('00');
      var timeSec = $('<span>').addClass('sec').text('00');
      var startStopBtn = $('<a>').attr('href', '').addClass('start-stop').text('Start');
      var resetBtn = $('<a>').attr('href', '').addClass('reset').text('Reset');
      stopwatchFace = stopwatchFace.append(timeHour).append(timeMin).append(timeSec);
      instance.html('').append(stopwatchFace).append(startStopBtn).append(resetBtn);

      startStopBtn.bind('click', function(e) {
        e.preventDefault();
        var button = $(this);
        if(button.text() === 'Start') {
          timer = setInterval(runStopwatch, 1000);
          button.text('Stop');
        } else {
          clearInterval(timer);
          button.text('Start');
        }
      });

      resetBtn.bind('click', function(e) {
          e.preventDefault();
          clearInterval(timer);
          startStopBtn.text('Stop');
          timer = 0;
          timeHour.text('00');
          timeMin.text('00');
          timeSec.text('00');
      });

      function runStopwatch() {
        // We need to get the current time value within the widget.
        var hour = parseFloat(timeHour.text());
        var minute = parseFloat(timeMin.text());
        var second = parseFloat(timeSec.text());

        second++;

        if(second > 59) {
          second = 0;
          minute = minute + 1;
        }

        if(minute > 59) {
          minute = 0;
          hour = hour + 1;
        }

        timeHour.html("0".substring(hour >= 10) + hour);
        timeMin.html("0".substring(minute >= 10) + minute);
        timeSec.html("0".substring(second >= 10) + second);
      }
    });
  }
})(jQuery);