const Discord = require('discord.js');
const logger = require('winston');
const ytdl = require('ytdl-core');
const queue = new Map();
const { prefix, token } = require('./config.json');
const botID = "608365015610949661";
var commandUsed = false;


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var client = new Discord.Client();
client.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');
    client.user.setActivity('Fromis_9', { type: 'LISTENING' });
});
//add role on join
client.on('guildMemberAdd', guildMember => {
 var newRole = guildMember.guild.roles.find(role => role.name === 'Test');
 guildMember.addRole(newRole);
});
//ping
client.on('message', message => {
  if(commandUsed && message.author.bot){
    commandUsed = true;
    return;
  }else {
    if (message.content === `${prefix}ping`) {
      message.channel.send('Pong!');
    }
  }
});
//Member Count
client.on('message', message => {
  if(commandUsed && message.author.bot){
    return;
  }else {
    if (message.content === `${prefix}members`) {
      message.channel.send(`Total Member Count: ${message.guild.memberCount}`);
    }
    commandUsed = true;
  }
});
//Im and Yurr response
client.on('message', message => {
let str = message.content;
let n = str.search("!hot");
  if (n > -1) {
    return commandUsed = true;
  } else {
    if (commandUsed && message.author.bot) {
      return;
    }else {
      commandUsed = true;
      var stringArray = message.content.split(' ');
      var found;
      var foundAt;
      var newMessage = " ";
      var length = stringArray.length;
      for(let i = 0; i < length; i++) {
        if (stringArray[i] === "I'm" | stringArray[i] === "Im" | stringArray[i] === "im") {
          foundAt = i;
          found = true;
          for (let i = foundAt; length > i+1; i++) {
            newMessage = newMessage + stringArray[i+1] + " ";
          }
          newMessage = " " + newMessage.trim();
          if (found && newMessage !== " Pub Bot") {
            return message.channel.send("Hi" + newMessage + ", I'm Pub Bot");
          }
        } else if (!found) {
          if (stringArray[i] === "yurr" | stringArray[i] === "Yurr") {
            console.log(stringArray[i]);
            if (!stringArray[i] == '!hot') {
              return;
            }
            return message.channel.send('I agree with the above statement');
          }
        }
      }
    }
  }
});
//max
client.on('message', message => {
  if(commandUsed && message.author.bot){
    commandUsed = true;
    return;
  }else {
    if (message.content === `${prefix}max`) {
      return message.channel.send('시간이');
    }
  }
});
//8ball
client.on('message', message => {
  var rand = Math.floor(Math.random()*20);
  const ballAnswers = ["It is certain", "It is decidedly so", "Without a doubt", "Yes, definitely", "You may rely on it",
                    "As I see it, yes", "Most likely", "Outlook good", "Yes", "All signs point to yes",
                    "Reply hazy, try again", "Ask again later", "Better not tell you now", "Cannot predict now",
                    "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no",
                    "Outlook not so good", "Very doubtful"];
  if (commandUsed && message.author.bot) {
    commandUsed = true;
    return;
  } else {
    if (message.content.substring(0,6) === `${prefix}8ball`) {
      var newMessage = ballAnswers[rand];
      message.channel.send(newMessage);
    }
  }
});
//hot
client.on('message', message => {
  if(!commandUsed && message.author.bot){
    commandUsed = true;
    return;
  }else {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command === `hot`) {
      var newMessage = message.content.slice(4);
      var rand = Math.floor(Math.random()*2);
      if (rand === 0) {
        return message.channel.send(newMessage + ' is HOT!');
      }else if (rand === 1) {
        return message.channel.send(newMessage + ' is NOT HOT!');
      }
    }
  }
  commandUsed = true;
});
// client.on('message', function (user, userID, channelID, message, evt, guild, member) {
//     // Our bot needs to know if it will execute a command
//     commandUsed = false;
//     if(userID != botID && message.substring(0, 1) == prefix && !commandUsed) {
//     // It will listen for messages that will start with `!`
//       var args = message.substring(1).split(' ');
//       var cmd = args[0];
//       args = args.splice(1);
//       switch(cmd) {
//       // Just add any case commands if you want to..
//       // !ping
//         // case 'ping':
//         //   client.sendMessage({
//         //     to: channelID,
//         //     message: 'Pong!'
//         //   });
//         // break;
//      //!hot
//         case 'hot':
//           var rand = Math.floor(Math.random()*2);
//           if (rand == 0) {
//             client.sendMessage({
//               to: channelID,
//               message: message.substring(4) + ' is HOT!'
//             });
//           }else if (rand == 1) {
//             client.sendMessage({
//               to: channelID,
//               message: message.substring(4) + ' is NOT HOT!'
//             });
//         }
//         break;
//         //sam
//         case 'sam':
//           client.sendMessage({
//             to: channelID,
//             message: 'A good kid :))'
//           });
//         break;
//        //owen
//         case 'owen':
//           client.sendMessage({
//             to: channelID,
//             message: 'Short'
//           });
//         break;
//       //max
//         case 'max':
//           client.sendMessage({
//             to: channelID,
//             message: '시간이'
//           });
//         break;
//         case 'chris':
//           client.sendMessage({
//             to: channelID,
//             message: "My great creator"
//           });
//         break;
//         case 'cody':
//           client.sendMessage({
//             to: channelID,
//             message: "magine bein a bitch :))\ncould not be me :))"
//           });
//         break;
//         case '8ball':
//           var rand = Math.floor(Math.random()*20);
//           var ballAnswers = ["It is certain", "It is decidedly so", "Without a doubt", "Yes, definitely", "You may rely on it",
//                             "As I see it, yes", "Most likely", "Outlook good", "Yes", "All signs point to yes",
//                             "Reply hazy, try again", "Ask again later", "Better not tell you now", "Cannot predict now",
//                             "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no",
//                             "Outlook not so good", "Very doubtful"];
//           client.sendMessage({
//             to: channelID,
//             message: ballAnswers[rand]
//           });
//         break;
//     //default statement, if command is incorrect
//         default:
//           client.sendMessage({
//             to: channelID,
//             message: 'That is not a valid command, please try again :))'
//           });
//         break;
//       }
//     }else {
//       commandUsed = true;
//     }
// });
// client.on('message', function (user, userID, channelID, message, evt) {
//   var stringArray = message.split(' ');
//   var found;
//   var foundAt;
//   var newMessage = " ";
//   var length = stringArray.length;
//   if(userID != botID && commandUsed && message != newMessage) {
//     for(let i = 0; i < length; i++) {
//       if(stringArray[i] === "I'm" | stringArray[i] === "Im" | stringArray[i] === "im") {
//         foundAt = i;
//         found = true;
//       } else if (!found && (stringArray[i] === "yurr" | stringArray[i] === "Yurr")) {
//         client.sendMessage ({
//           to: channelID,
//           message: "I agree with the above statement"
//         });
//       }
//     }
//     for (let i = foundAt; length > i+1; i++) {
//       newMessage = newMessage + stringArray[i+1] + " ";
//     }
//     newMessage = " " + newMessage.trim();
//     if(found && newMessage !== " Pub Bot") {
//       client.sendMessage({
//         to: channelID,
//         message: "Hi" + newMessage + ", I'm Pub Bot"
//       });
//     }
//   }else {
//     commandUsed = true;
//   }
// });
client.login(token);
