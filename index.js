// From https://github.com/howdyai/botkit#basic-usage
var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false,
});

// connect the bot to a stream of messages
controller.spawn({
  token: 'xoxb-854945260992-847029510225-1Bt2EB3n3JFyxZMZzhOkQ0Lr',
  name: 'midhya'
}).startRTM()

// give the bot something to listen for.
controller.hears('hello', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {

  bot.reply(message, 'I am midhya how can I help you ?');

});