const Discord = require('discord.js');
const Client = require('./client/client');
const fs = require('fs');
const logger = require('winston');
const { prefix, token } = require('./config.json');
const Tools = require('./sql/databaseTools');
const alphabet = require('emoji-alphabet').alphabet;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
const tools =  new Tools();
// Initialize Discord Bot
const client = new Client();
client.commands = new Discord.Collection();
client.adminCommands = new Discord.Collection();
client.music = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/everyone').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/everyone/${file}`);
  client.commands.set(command.name, command);
}
const adminCommand = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
for (const file of adminCommand) {
  const command = require(`./commands/admin/${file}`);
  client.adminCommands.set(command.name, command);
}
const music = fs.readdirSync('./commands/music').filter(file => file.endsWith('.js'));
for (const file of music) {
  const command = require(`./commands/music/${file}`);
  client.music.set(command.name, command);
}

//logs and sets activity when bot is ready
client.once('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.user.username + ' - (' + client.user.id + ')');
    client.user.setActivity(`Currently in Beta | ${prefix}help`);
    logger.info('Servers: ');
    client.guilds.forEach((guild) => {
      logger.info('-' + guild.name + '-' + guild.id);	
    });
    logger.info(client.commands);
    tools.Tags.sync();
    tools.ComDisabled.sync();
});

//add role on join
client.on('guildMemberAdd', async guildMember => {
  try {
    let autoRole = await tools.Tags.findAll({attributes:["role"], where: {guildID: guildMember.guild.id}});
    if(autoRole) {
      let tempRole = autoRole.map((autoRole) => autoRole.role);
      let newRole = guildMember.guild.roles.find(role => role.name === tempRole[0] );
      if (newRole == null) {
        return;
      }
      guildMember.addRole(newRole);
    } return;
  } catch (err) {
    return;
  }
});

//commands
client.on('message', async message => {
  if(message.author.bot) {
    return;
  }
  if (!message.content.startsWith(prefix)) {
    return;
  }
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  if(commandName == "") {
    return;
  }
  if (client.commands.has(commandName)) {
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
        return message.channel.send('There was an error executing that command.');
    }
  }else if (client.adminCommands.has(commandName)) {
    const adminCommand = client.adminCommands.get(commandName);
    if(adminCommand.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}`;
      if (adminCommand.usage) {
        reply += `\nThe proper usage would be: \'${prefix}${adminCommand.name} ${adminCommand.usage}`;
      }
      return message.channel.send(reply);
    }
    try {
      adminCommand.execute(message, args);
    } catch (error) {
      console.error(error);
      return message.channel.send('There was an error executing that command.');
    }
  } else if (client.music.has(commandName)) {
    const music = client.music.get(commandName);
    if(music.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}`;
      if (adminCommand.usage) {
        reply += `\nThe proper usage would be: \'${prefix}${music.name} ${music.usage}`;
      }
      return message.channel.send(reply);
    }
    try {
      music.execute(message, args);
    } catch (error) {
      console.error(error);
      return message.channel.send('There was an error executing that command.');
    }
  } else {
    return message.channel.send('That is not a valid command, please try again :))');
  }
});

//Im response
client.on('message', async message => {
  if (message.content.startsWith(prefix)) {
    return;
  }else {
    let get = await tools.getimDisabled(message);
    if (get) {
      var input = message.content.toLowerCase();
      var output = "";
      if (message.author.bot) {
        return;
      } else {
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
});

//Yurr Response
client.on('message', async message => {
  if (message.content.startsWith(prefix)) {
    return;
  }else {
    const get = await tools.getyurrDisabled(message);
    if (get) {
      var input = message.content.toLowerCase().split(' ');
      const output = "I agree with the above statement";
      if (message.author.bot) {
        return;
      } else {
        if (input.includes('im') || input.includes("i'm")) { 
          return;
        }else {
          let wideyurr = input.join(' ');
          if (input.includes('yurr') | wideyurr.includes('y u r r')) {
            return message.channel.send(output);
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