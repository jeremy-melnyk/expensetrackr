module.exports = (function () {
  var os = require('os');

  var generateEventList = function (user) {
    if (!user || !user.events || user.events.length == 0) {
      return "There are no events on your list. Say `add _event_` to add something.";
    }

    var lines = [];

    var initialLine = "Here are your current events:";
    lines.push(initialLine);

    for (var i = 0; i < user.events.length; i++) {
      var line = `- \`${i + 1}\`) ${user.events[i]}`;
      lines.push(line);
    }

    var endingLine = "Reply with `remove _eventId_` to remove an event.";
    lines.push(endingLine);

    return lines.join(os.EOL);
  };

  return {
    generateEventList
  };
})();