module.exports = (function () {
  var generateExpenseList = function (user) {
    if (!user || !user.expenses || !user.expenses.length == 0) {
      return "There are no expenses on your list. Say `add _expense_` to add something.";
    }

    const lines = [];

    const initialLine = "Here are your current expenses:";
    lines.push(initialLine);

    for (var i = 0; i < user.expenses.length; i++) {
      const line = `> ${i + 1}) ${user.expense[i]}`;
      lines.push(line);
    }

    const endingLine = "Reply with `remove _number_` to remove an expense.";
    lines.push(endingLine);

    return lines.join('\n');
  };

  return {
    generateExpenseList
  };
})();