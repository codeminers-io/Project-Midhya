// From https://github.com/howdyai/botkit#basic-usage
var Botkit = require('botkit');
var rasa = require('./middleware')({rasa_uri: 'http://localhost:5000'});

var controller = Botkit.slackbot({
  debug: false,
  clientId: '',
  clientSecret: '',
  clientSigningSecret: '',
  scopes: ['bot'],
  json_file_store: __dirname + '/.db/'
});

// Override receive method in botkit
controller.middleware.receive.use(rasa.receive);

// connect the bot to a stream of messages
controller.spawn({
  token: '',
  name: 'midhya'
}).startRTM()

// Override hears method in botkit
controller.changeEars(function (patterns, message) {
  return rasa.hears(patterns, message);
});

controller.hears([''],'message_received,direct_message,direct_mention,mention', rasa.hears, function(bot, message) {

  console.log('Intent:', message.intent);
  console.log('Entities:', message.entities);    

  bot.reply(message,"Intent: " + message.intent.name);
});

