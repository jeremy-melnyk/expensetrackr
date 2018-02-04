module.exports = (function () {
  var initUser = function (userId) {
    return {
      id: userId,
      expenses: []
    };
  };

  return {
    initUser
  };
})();