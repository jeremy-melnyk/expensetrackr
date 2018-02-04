module.exports = (function () {
  var initUser = function (userId) {
    return {
      id: userId,
      expenses: [],
      events: []
    };
  };

  return {
    initUser
  };
})();