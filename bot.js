const Discord = require('discord.js');
const fs = require('fs');
const logger = require('winston');
const { prefix, adminPrefix, token } = require('./config.json');
const Sequelize = require('sequelize');
const permissions = new Discord.Permissions("MANAGE_GUILD");
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
const queue = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//database
//connect
const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'database.sqlite'
});
//create table with columns guildID and role
const Tags = sequelize.define('tags', {
  guildID: {
    type: Sequelize.STRING,
    unique: true
  },
  role: {
    type: Sequelize.STRING,
    get : function() {
      var name = this.getDataValue('role');
      return name;
    }
  }
});
//logs and sets activity when bot is ready
client.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.user.username + ' - (' + client.user.id + ')');
    client.user.setActivity('Fromis_9', { type: 'LISTENING' });
    logger.info('Servers: ');
    client.guilds.forEach((guild) => {
      logger.info('-' + guild.name + '-' + guild.id)
    })
    logger.info(client.commands);
    Tags.sync();
});

//add role on join
client.on('guildMemberAdd', async guildMember => {
  try {
    let autoRole = await Tags.findAll({attributes:["role"], where: {guildID: guildMember.guild.id}});
    if(autoRole) {
      let tempRole = autoRole.map((autoRole) => autoRole.role);
      let newRole = guildMember.guild.roles.find(role => role.name === tempRole[0] );
      guildMember.addRole(newRole);
    }
  } catch (err) {
    console.error(err.message);
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
//autorole
client.on('message', async message => {
	if (message.content.startsWith(adminPrefix)) {
		const input = message.content.slice(adminPrefix.length).split(/ +/);
		const command = input.shift().toLowerCase();
		const commandArgs = input.join(' ');
    if (message.member.hasPermission(permissions)) {
  		if (command === 'autorole') {
        const splitArgs = commandArgs.split(' ');
        const tagName = splitArgs.shift();
        try {
        	// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        	const tag = await Tags.create({
        		guildID: message.guild.id,
        		role: tagName,
        	});
        	return message.reply(`Role ${tag.role} added.`);
        }
        catch (e) {
        	if (e.name === 'SequelizeUniqueConstraintError') {
        		return message.reply('Role already added, to edit use \"editautorole\"' );
        	}
        	return message.reply('Something went wrong with adding a role.');
        }
    } else if (command === 'editautorole') {
        const splitArgs = commandArgs.split(' ');
        const tagName = splitArgs.shift();
    // equivalent to: UPDATE tags (descrption) values (?) WHERE name='?';
        const affectedRows = await Tags.update({ role: tagName }, { where: { guildID: message.guild.id } });
        if (affectedRows > 0) {
    	      return message.reply(`Autorole was changed`);
        }
           return message.reply(`Could not find a role with name ${tagName}.`);
    	} else if (command === 'removeautorole') {
        let remove = await Tags.destroy({where: { guildID : message.guild.id}});
        if (!remove) {
          return message.reply('No role assigned to server.');
        } else {
          return message.reply('AutoRole removed.');
        }
    	}
    } else {
      return message.reply('You do not have permission to use that command.');
    }
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
