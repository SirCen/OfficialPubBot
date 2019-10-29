var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const ytdl = require('ytdl-core');
const queue = new Map();
const prefix = "!";
const botID = "608365015610949661";
var commandUsed = false;

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
    client.setPresence({game : { name : 'with rope'}, status : 'online'});
});

client.on('guildMemberAdd', guildMember => {
 console.log('User ' + guildMember.username + ' has joined the server!');

 //var newRole = guildMember.guild.roles('name','Test');
 guildMember.roles.add('Test');
});
client.on('message', function (user, userID, channelID, message, evt, guild, member) {
    // Our bot needs to know if it will execute a command
    commandUsed = false;
    if(userID != botID && message.substring(0, 1) == prefix && !commandUsed) {
    // It will listen for messages that will start with `!`
      var args = message.substring(1).split(' ');
      var cmd = args[0];
      args = args.splice(1);
      switch(cmd) {
      // Just add any case commands if you want to..
      // !ping
        case 'ping':
          client.sendMessage({
            to: channelID,
            message: 'Pong!'
          });
        break;
     //!hot
        case 'hot':
          var rand = Math.floor(Math.random()*2);
          if (rand == 0) {
            client.sendMessage({
              to: channelID,
              message: message.substring(4) + ' is HOT!'
            });
          }else if (rand == 1) {
            client.sendMessage({
              to: channelID,
              message: message.substring(4) + ' is NOT HOT!'
            });
        }
        break;
        //sam
        case 'sam':
          client.sendMessage({
            to: channelID,
            message: 'A good kid :))'
          });
        break;
       //owen
        case 'owen':
          client.sendMessage({
            to: channelID,
            message: 'Short'
          });
        break;
      //max
        case 'max':
          client.sendMessage({
            to: channelID,
            message: '시간이'
          });
        break;
        case 'chris':
          client.sendMessage({
            to: channelID,
            message: "My great creator"
          });
        break;
        case 'cody':
          client.sendMessage({
            to: channelID,
            message: "magine bein a bitch :))\ncould not be me :))"
          });
        break;
        case '8ball':
          var rand = Math.floor(Math.random()*20);
          var ballAnswers = ["It is certain", "It is decidedly so", "Without a doubt", "Yes, definitely", "You may rely on it",
                            "As I see it, yes", "Most likely", "Outlook good", "Yes", "All signs point to yes",
                            "Reply hazy, try again", "Ask again later", "Better not tell you now", "Cannot predict now",
                            "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no",
                            "Outlook not so good", "Very doubtful"];
          client.sendMessage({
            to: channelID,
            message: ballAnswers[rand]
          });
        break;
    //default statement, if command is incorrect
        default:
          client.sendMessage({
            to: channelID,
            message: 'That is not a valid command, please try again :))'
          });
        break;
      }
    }else {
      commandUsed = true;
    }
});
client.on('message', function (user, userID, channelID, message, evt) {
  var stringArray = message.split(' ');
  var found;
  var foundAt;
  var newMessage = " ";
  var length = stringArray.length;
  if(userID != botID && commandUsed && message != newMessage) {
    for(let i = 0; i < length; i++) {
      if(stringArray[i] === "I'm" | stringArray[i] === "Im" | stringArray[i] === "im") {
        foundAt = i;
        found = true;
      } else if (!found && (stringArray[i] === "yurr" | stringArray[i] === "Yurr")) {
        client.sendMessage ({
          to: channelID,
          message: "I agree with the above statement"
        });
      }
    }
    for (let i = foundAt; length > i+1; i++) {
      newMessage = newMessage + stringArray[i+1] + " ";
    }
    newMessage = " " + newMessage.trim();
    if(found && newMessage !== " Pub Bot") {
      client.sendMessage({
        to: channelID,
        message: "Hi" + newMessage + ", I'm Pub Bot"
      });
    }
  }else {
    commandUsed = true;
  }
});
