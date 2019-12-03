var env = require('node-env-file');
env(__dirname + '/.env');

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
  replyWithTyping: true,
  json_file_store: __dirname + '/data/.db/'
};

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.socketbot(bot_options);

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Open the web socket server
controller.openSocketServer(controller.httpserver);

// Start the bot brain in motion!!
controller.startTicking();

