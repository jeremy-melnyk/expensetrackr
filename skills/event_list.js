var eventList = require('../common').eventList;
var userUtil = require('../common').userUtil;

module.exports = function (controller) {
  const mentions = "direct_message,direct_mention";
  const addErrorMsg = "I experienced an error adding your event.";
  const emptyArgErrorMsg = "Sorry, I couldn't understand you.";

  /* List events */
  controller.hears(['events'], mentions, function (bot, message) {
    if(!message){
      bot.reply(message, emptyArgErrorMsg);
    }
    // Get user forms storage
    controller.storage.users.get(message.user, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        const reply = eventList.generateEventList(user);
        bot.reply(message, reply);
      }
    });
  });

  /* Add events */
  controller.hears(['add event (.*)'], mentions, function (bot, message) {
    if(!message){
      bot.reply(message, emptyArgErrorMsg);
    }
    const newEvent = message.match.length > 1 ? message.match[1] : null;
    if (newEvent === null) {
      bot.reply(message, emptyArgErrorMsg);
    }

    controller.storage.users.get(message.user, function (err, user) {
      if (err) {
        console.log(err);
        bot.reply(message, addErrorMsg);
      } else {
        if (!user) {
          const userId = message.user;
          user = userUtil.initUser(userId);
        }

        user.events.push(newEvent);

        controller.storage.users.save(user, function (err, saved) {
          if (err) {
            console.log(err);
            bot.reply(message, addErrorMsg);
          } else {
            bot.reply(message, 'Event added!');
          }
        });
      }
    });
  });

  // listen for a user saying "remove event <id>" and remove that item
  controller.hears(['remove event (.*)'], mentions, function (bot, message) {
        if(!message){
      bot.reply(message, emptyArgErrorMsg);
    }
    const eventIdToRemove = message.match.length > 1 ? message.match[1] : "";
    if (eventIdToRemove === null) {
      bot.reply(message, emptyArgErrorMsg);
    }

    if (isNaN(eventIdToRemove)) {
      bot.reply(message, 'Please specify an event ID.');
    } else {
      // Adjust for 0-based array index
      const eventIdIndex = parseInt(eventIdToRemove) - 1;

      controller.storage.users.get(message.user, function (err, user) {

        if (!user) {
          const userId = message.user;
          user = userUtil.initUser(userId);
        }

        if (eventIdIndex < 0 || eventIdIndex >= user.events.length) {
          const badEventReply = `Sorry, your input is out of range. Right now there are ${user.eventss.length} events on your list.`;
          bot.reply(message, badEventReply);
        } else {
          const event = user.events.splice(eventIdIndex, 1);

          // reply with a strikethrough message...
          bot.reply(message, '~' + event + '~');

          if (user.events.length > 0) {
            const remainingEvents = eventList.generateEventList(user);
            const eventReply = `Here are our remaining events:\n ${remainingEvents}`;
            bot.reply(message, eventReply);
          } else {
            bot.reply(message, 'Your events list is now empty!');
          }
        }
      });
    }
  });
}