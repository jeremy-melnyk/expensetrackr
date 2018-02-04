var expenseList = require('../common').expenseList;
var userUtil = require('../common').userUtil;
var investmentUtil = require('../common').investmentUtil;

module.exports = function (controller) {
  const mentions = "direct_message,direct_mention";

  /* Retirement */
  controller.hears(['create retirement plan'], mentions, investmentUtil.retirementPlan(controller));

  /* Home Buy */
  controller.hears(['create home buy plan'], mentions, investmentUtil.homeBuyPlan(controller));

  /* Personal */
  controller.hears(['create personal plan'], mentions, investmentUtil.personalPlan(controller));
}