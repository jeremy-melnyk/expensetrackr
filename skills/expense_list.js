var expenseList = require('../common').expenseList;

module.exports = function (controller) {
  const mentions = "direct_message,direct_mention";

  /* List expenses */
  controller.hears(['expenses'], mentions, function (bot, message) {
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
}