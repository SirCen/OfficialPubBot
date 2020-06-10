const Discord = require('discord.js');
const fs = require('fs');
const logger = require('winston');
const { prefix, adminPrefix, token } = require('./config.json');
const Tools = require('./sql/databaseTools');
const alphabet = require('emoji-alphabet').alphabet;
let commandUsed = false;
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
const tools =  new Tools();
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
    client.user.setActivity('Currently in Beta | ?help');
    logger.info('Servers: ');
    client.guilds.forEach((guild) => {
      logger.info('-' + guild.name + '-' + guild.id)
    })
    logger.info(client.commands);
});

//add role on join
client.on('guildMemberAdd', async guildMember => {
  try {
    let autoRole = await tools.Tags.findAll({attributes:["role"], where: {guildID: guildMember.guild.id}});
    if(autoRole) {
      let tempRole = autoRole.map((autoRole) => autoRole.role);
      let newRole = guildMember.guild.roles.find(role => role.name === tempRole[0] );
      guildMember.addRole(newRole);
    } return;
  } catch (err) {
    return;
  }
});

//commands
client.on('message', async message => {
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
  }else {
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
  }
});

//Im response
client.on('message', async message => {
  if (message.content.startsWith(adminPrefix) || message.content.startsWith(prefix)) {
    return;
  }else {
    let get = await tools.getimDisabled(message);
    if (get) {
      var input = message.content.toLowerCase();
      let str = message.content;
      let n = str.includes(prefix + "hot");
      if (n) {
        return commandUsed = true;
      }else {
        var output = "";
        if (commandUsed && message.author.bot) {
          return;
        } else {
          commandUsed = true;
          const msg = input.split(' ');
          var newmsg = "";
          msg.forEach(element => {
            if (element == 'im') {
              var index = input.indexOf('im');
              var end = input.substring(index+2).split(' ');
              for(let i = 0; i < end.length; i++) {
                newmsg += end[i] + " ";
              }
              newmsg = newmsg.trimRight();
              output += "Hi" + newmsg + ", I'm Pub Bot";
              if (newmsg != '') {
                return message.channel.send(output);
              }
            } else if (element =="i'm") {
              var index = input.indexOf("i'm");
              var end = input.substring(index+3).split(' ');
              for(let i = 0; i < end.length; i++) {
                  newmsg += end[i] + " ";
              }
              newmsg = newmsg.trimRight();
              output += "Hi " + newmsg + ", I'm Pub Bot";
              if (newmsg != '') {
                return message.channel.send(output);
              }
            }
          });
        }
      }
    }
  }
});

//Yurr Response
client.on('message', async message => {
  if (message.content.startsWith(adminPrefix) || message.content.startsWith(prefix)) {
    return;
  }else {
    const get = await tools.getyurrDisabled(message);
    if (get) {
      var input = message.content.toLowerCase();
      const output = "I agree with the above statement";
      let str = message.content;
      let n = str.includes(prefix + "hot");
      let found = false;
      if (n) {
        return commandUsed = true;
      }else {
        if (commandUsed && message.author.bot) {
          return;
        } else {
          commandUsed = true;
          if (input.includes('yurr') | input.includes('y u r r')) {
            var index = input.indexOf('yurr');
            var substring = input.substring(0, index);
            if ( input.includes('im ') || input.includes("i'm ")) { 
              found = true;
            }else if(!found) {          
              return message.channel.send(output);
            }
          }
        }
      }
    }
  }
});

//React to innit
client.on('message', message => {
  var input = message.content.toLowerCase();
  try { 
    const innit = message.guild.emojis.find(innit => innit.name === "innit");
    if (!message.author.bot) {
      if (input.includes('innit') | input.includes('i n n i t')){
        if (innit == null) {
          message.react("🇮").then(() => message.react("🇳")).then(() => message.react(alphabet['N'])).then(() => message.react("ℹ️")).then(() => message.react("🇹"));
          return;
        } else {
          return message.react(innit);
        }
      }
    }
  } catch(DiscordAPIError) {
    return;
  }
});

client.login(token);