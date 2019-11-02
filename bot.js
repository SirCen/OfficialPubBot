const Discord = require('discord.js');
const fs = require('fs');
const logger = require('winston');
const { prefix, token } = require('./config.json');
var commandUsed = false

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//logs and sets activity when bot is ready
client.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.user.username + ' - (' + client.user.id + ')');
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
  }
  if (!message.content.startsWith(prefix)) {
    return;
  }
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  if (!client.commands.has(commandName)) {
    return message.channel.send('That is not a valid command, please try again :))');
  }
  const command = client.commands.get(commandName);
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \'${prefix}${command.name} ${command.usage}`;
    }
    return message.channel.send(reply);
  }
  try {
	   command.execute(message, args);
   } catch (error) {
	    console.error(error);
	     message.reply('there was an error trying to execute that command!');
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
client.login(token);
