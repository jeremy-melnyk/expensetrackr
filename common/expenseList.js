module.exports = (function () {
  var os = require('os');

  var generateExpenseList = function (user) {
    if (!user || !user.expenses || user.expenses.length == 0) {
      return "There are no expenses on your list. Say `add _expense_` to add something.";
    }

    var lines = [];

    var initialLine = "Here are your current expenses:";
    lines.push(initialLine);

    for (var i = 0; i < user.expenses.length; i++) {
      var line = `> \`${i + 1}\`) ${user.expenses[i]}`;
      lines.push(line);
    }

    var endingLine = "Reply with `remove _expenseId_` to remove an expense.";
    lines.push(endingLine);

    const delim = `  ${os.EOL}`;
    return lines.join(delim);
  };

  return {
    generateExpenseList
  };
})();