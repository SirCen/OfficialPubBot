var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const ytdl = require('ytdl-core');
const queue = new Map();
const prefix = "!";

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var client = new Discord.Client({
   token: auth.token,
   autorun: true
});
client.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');
});

//bot.on('guildMemberAdd', member => {
  //console.log('User' + member.user + 'has joined the server!');

//  var role = member.guild.find(role => role.name === 'Test');
//  member.addRole(role).catch(console.error);
//});
client.on('message', function (user, userID, channelID, message, evt, guild, member) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == prefix) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                client.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
            //!hot
            case 'hot':
              var rand = Math.floor(Math.random()*2);
              if (rand == 0) {
                client.sendMessage({
                  to: channelID,
                  message: message.substring(4) + ' is HOT!'
              });
            }
              else if (rand == 1) {
                client.sendMessage({
                  to: channelID,
                  message: message.substring(4) + ' is NOT HOT!'
                });
              }
            break;
            case 'sam':
              client.sendMessage({
                to: channelID,
                message: 'A good kid :))'
              });
            break;
            case 'owen':
              client.sendMessage({
                to: channelID,
                message: 'Short'
              })
            break;
            default:
            client.sendMessage({
              to: channelID,
              message: 'That is not a valid command, please try again :))'
            });
            break;
          }
        }
});
client.on('message', function (user, userID, channelID, message, evt) {
  var stringArray = message.split(' ');
  var found;
  var foundAt;
  var newMessage = " ";
  var length = stringArray.length;
  console.log(stringArray[1]);
  if(message != newMessage) {
    for(let i = 0; i < length; i++){
      if(stringArray[i] === "I'm" | stringArray[i] === "Im" | stringArray[i] === "im"){
        console.log("here");
        foundAt = i;
        found = true;
      }
    }
    for (let i = foundAt; length > i+1; i++){
      console.log("here1");
      newMessage = newMessage + stringArray[i+1] + " ";
    }
    //newMessage = newMessage + " ";
    if(found && newMessage !== " Pub Bot"){
      console.log("here2");
      client.sendMessage({
        to: channelID,
        message: "Hi" + newMessage + ", I am Pub Bot"
      })
    }
  }
    // if (message.substring(0,2)=="im"|| message.substring(0,2)=="Im") {
    //   client.sendMessage({
    //     to: channelID,
    //     message: "Hi " + message.substring(3) + ", I'm Pub Bot"
    //   })
    // }
    // else if (message.substring(0,3)=="I'm") {
    //   client.sendMessage({
    //     to: channelID,
    //     message: "Hi " + message.substring(4) + ", I'm Pub Bot"
    //   })
    // }
  });
