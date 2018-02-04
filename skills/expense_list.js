var expenseList = require('../common').expenseList;
var userUtil = require('../common').userUtil;

module.exports = function (controller) {
  const mentions = "direct_message,direct_mention";
  const addErrorMsg = "I experienced an error adding your expense";
  const emptyArgErrorMsg = "Sorry, I couldn't understand you.";

  /* List expenses */
  controller.hears(['expenses'], mentions, function (bot, message) {
    if (!message) {
      bot.reply(message, emptyArgErrorMsg);
    }
    // Get user forms storage
    controller.storage.users.get(message.user, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        const reply = expenseList.generateExpenseList(user);
        bot.reply(message, reply);
      }
    });
  });

  /* Add expenses */
  controller.hears(['add expense (.*)'], mentions, function (bot, message) {
    if (!message) {
      bot.reply(message, emptyArgErrorMsg);
    }
    const newExpense = message.match.length > 1 ? message.match[1] : null;
    if (newExpense === null) {
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

        user.expenses.push(newExpense);

        controller.storage.users.save(user, function (err, saved) {
          if (err) {
            console.log(err);
            bot.reply(message, addErrorMsg);
          } else {
            bot.reply(message, 'You got it!');
          }
        });
      }
    });
  });

  // listen for a user saying "remove expense <id>" and remove that item
  controller.hears(['remove expense (.*)'], mentions, function (bot, message) {
    if (!message) {
      bot.reply(message, emptyArgErrorMsg);
    }
    const expenseIdToRemove = message.match.length > 1 ? message.match[1] : "";
    if (expenseIdToRemove === null) {
      bot.reply(message, emptyArgErrorMsg);
    }

    if (isNaN(expenseIdToRemove)) {
      bot.reply(message, 'Please specify an expense ID.');
    } else {
      // Adjust for 0-based array index
      const expenseIdIndex = parseInt(expenseIdToRemove) - 1;

      controller.storage.users.get(message.user, function (err, user) {

        if (!user) {
          const userId = message.user;
          user = userUtil.initUser(userId);
        }

        if (expenseIdIndex < 0 || expenseIdIndex >= user.expenses.length) {
          const badExpenseReply = `Sorry, your input is out of range. Right now there are ${user.expenses.length} expenses on your list.`;
          bot.reply(message, badExpenseReply);
        } else {
          const expense = user.expenses.splice(expenseIdIndex, 1);

          controller.storage.users.save(user, function (err, saved) {
            if (err) {
              console.log(err);
              bot.reply(message, addErrorMsg);
            } else {
              var expenseReply = `Removed ${expense}.  \n`;
              if (saved.expenses.length > 0) {
                const remainingExpenses = expenseList.generateExpenseList(saved);
              } else {
                expenseReply += 'Your expense list is now empty!';
              }

              bot.reply(message, expenseReply);
            }
          });
        }
      });
    }
  });
}