const Discord = require('discord.js');
const fs = require('fs');
const logger = require('winston');
const { prefix, adminPrefix, token } = require('./config.json');
const Sequelize = require('sequelize');
const alphabet = require('emoji-alphabet').alphabet;
const permissions = new Discord.Permissions("MANAGE_GUILD");
let commandUsed = false;
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

// create table with columns of GuildId, channelID, and bool disabled
const ComDisabled = sequelize.define('comDisable', {
  guildID : {
    type: Sequelize.STRING
  },
  channelID : {
    type: Sequelize.STRING,
    unique: true
  },
  imDisabled : {
    type: Sequelize.INTEGER,
    defaultValue: 0
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
    ComDisabled.sync();
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
  		if (command === 'ar') {
        const tagName = commandArgs;
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
        		return message.reply('Role already added, to edit use \"editar\"' );
        	}
        	return message.reply('Something went wrong with adding a role.');
        }
    } else if (command === 'editar') {
        const tagName = commandArgs;
    // equivalent to: UPDATE tags (descrption) values (?) WHERE name='?';
        const affectedRows = await Tags.update({ role: tagName }, { where: { guildID: message.guild.id } });
        if (affectedRows > 0) {
    	      return message.reply(`Autorole was changed`);
        }
           return message.reply(`Could not find a role with name ${tagName}.`);
    	} else if (command === 'removear') {
        let remove = await Tags.destroy({where: { guildID : message.guild.id}});
        if (!remove) {
          return message.reply('No role assigned to server.');
        } else {
          return message.reply('AutoRole removed.');
        }
    	}
    } else {
      return;
    }
  }
});

client.on('message', async message => {
  if (message.content.startsWith(adminPrefix)) {
    const command = message.content.slice(adminPrefix.length).split(/ +/);
    if (command === 'disableIm') {
      try {
        const add = await ComDisabled.create({
          guildID: message.guild.id,
          channelID: message.guild.channels.id,
          imDisabled: 1 
        });
        return message.reply("\'im\' response disabled for this channel, renable with \"enableIm\"");
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
          return message.reply('\"Im\" already disabled, renable with \"enableIm\"' );
        }
        return message.reply('Something went wrong with disabling Im response.');
      }
    } else if (command === 'enableIm') {
      const update = await ComDisabled.update({ imDisabled: 0 }, { where: { guildID: message.guild.id, channelID: message.guild.channels.id } });
      if (update > 0) {
        return message.reply(`Im response was renabled`);
    }
       return message.reply(`Need to disable to enable.`);
    }
  }
});

//Im response
client.on('message', message => {
  if (!message.content.startsWith(adminPrefix)) {
    var input = message.content.toLowerCase();
    let str = message.content;
    let n = str.search(prefix + "hot");
    if (n > -1) {
      return commandUsed = true;
    }else {
      var output = "";
      if (commandUsed && message.author.bot) {
        return;
      } else {
        commandUsed = true;
        if (input.includes('im')) {
          var index = input.indexOf('im');
          output += "Hi" + input.substring(index+2) + ", I'm Pub Bot";
          return message.channel.send(output);
        } else if (input.includes("i'm")) {
          var index = input.indexOf("i'm");
          output += "Hi" + input.substring(index+3) + ", I'm Pub Bot";
          return message.channel.send(output);
        }
      }
    }
  }
});

//Yurr Response
client.on('message', message => {
  var input = message.content.toLowerCase();
  const output = "I agree with the above statement";
  let str = message.content;
  let n = str.search(prefix + "hot");
  let found;
  if (n > -1) {
    return commandUsed = true;
  }else {
    if (commandUsed && message.author.bot) {
      return;
    } else {
      commandUsed = true;
      if (input.includes('yurr') | input.includes('y u r r')) {
        var index = input.indexOf('yurr');
        var substring = input.substring(0, index);
        if ( substring.search('im') || substring.search("i'm")) { 
          return found = true;
        }else if(!found) {          
          return message.channel.send(output);
        }
      }
    }
  }
})

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