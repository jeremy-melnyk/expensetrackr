module.exports = (function () {
  const addErrorMsg = "I experienced an error adding your expense";
  const emptyArgErrorMsg = "Sorry, I couldn't understand you.";
  const errorMsg = "Something went horribly wrong...";
  const getStartedMsg = "Great let's get started on creating your plan!";
  const newLine = "  \n";

  var retirementPlan = function (controller) {
    return function (bot, message) {
      if (!bot || !message) {
        console.log(errorMsg);
        return;
      }

      var reply = `${getStartedMsg}${newLine}`;
      var next = [{
        q: "Please choose an initial payment (min $1000).",
        p: /^(?!\(.*[^)]$|[^(].*\)$)\(?\$?(0|[1-9]\d{0,2}(,?\d{3})?)(\.\d\d?)?\)?$/
      },
      {
        q: "Please choose a term length (5 years, 10 years etc).",
        p: /^(0|[1-9][0-9]*)$/
      },
      {
        q: "Please choose a ecurring payment (min $100)",
        p: /^(?!\(.*[^)]$|[^(].*\)$)\(?\$?(0|[1-9]\d{0,2}(,?\d{3})?)(\.\d\d?)?\)?$/
      },
      {
        q: "Please enter a recurring period/interval (weekly, biweekly, monthly, quarterly)",
        p: /(weekly)*(biweekly)*(monthly)*(quarterly)*$/
      }];
      var index = 0;
      bot.createConversation(message, generateConversation(bot, message, next, next[index].q, next[index].p, index + 1));
    };
  };

  var homeBuyPlan = function (controller) {
    return function (bot, message) {
      if (!bot || !message) {
        console.log(errorMsg);
        return;
      }

      var reply = `${getStartedMsg}${newLine}`;
      var next = [{
        q: "Please choose an initial payment (min 10%).",
        p: /^(0|[1-9][0-9]*)$/
      },
      {
        q: "Please enter your house value.",
        p: /^(?!\(.*[^)]$|[^(].*\)$)\(?\$?(0|[1-9]\d{0,2}(,?\d{3})?)(\.\d\d?)?\)?$/
      },
      {
        q: "Please enter a term length (5 years, 10 years etc)",
        p: /^(0|[1-9][0-9]*)$/
      },
      {
        q: "Please enter a recurring period/interval (weekly, biweekly, monthly, quarterly)",
        p: /(weekly)*(biweekly)*(monthly)*(quarterly)*$/
      }];
      var index = 0;
      bot.createConversation(message, generateConversation(bot, message, next, next[index].q, next[index].p, index + 1));
    };
  };

  var personalPlan = function (controller) {
    return function (bot, message) {

    };
  };

  function generateConversation (bot, message, next, question, pattern, index){
    return function (err, convo) {
      // create a path for when a user says YES
      convo.addMessage({
        text: "",
      }, 'initial_thread');
  
      // create a path for when a user says NO
      // mark the conversation as unsuccessful at the end
      convo.addMessage({
        text: 'Oh alright. Hope to see you again!',
        action: 'stop', // this marks the converation as unsuccessful
      }, 'quit_thread');
  
      // create a path where neither option was matched
      // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
      convo.addMessage({
        text: 'Sorry I did not understand. Please try again.',
        action: 'default',
      }, 'bad_response');
  
      // Create a yes/no question in the default thread...
      convo.ask(question, [{
          pattern: pattern,
          callback: function (response, convo) {
            // TODO: hook into ETH
            convo.gotoThread('initial_thread');
          },
        },
        {
          pattern: /quit/,
          callback: function (response, convo) {
            convo.gotoThread('quit_thread');
          },
        },
        {
          default: true,
          callback: function (response, convo) {
            convo.gotoThread('bad_response');
          },
        }
      ]);
  
      convo.activate();
  
      convo.on('end', continueConvo(bot, message, next, index));
    };
  }

  function continueConvo(bot, message, next, index){
    return function (convo) {
      if (convo.successful() && index < next.length) {
        bot.createConversation(message, generateConversation(bot, message, next, next[index].q, next[index].p, index + 1));
      } else if (index >= next.length) {
        bot.reply(message, "Plan created!");
      } else {
        bot.reply(message, emptyArgErrorMsg);
      }
    };
  }

  return {
    retirementPlan,
    homeBuyPlan,
    personalPlan
  };
})();