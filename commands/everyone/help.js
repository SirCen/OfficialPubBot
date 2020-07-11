const { prefix } = require('../../config.json');
const {RichEmbed} = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
    const { commands, adminCommands, music } = message.client;
    let embed = new RichEmbed()
    .setColor("Yellow")
    .setTitle('Pub Bot Commands!')
    .setDescription(`This is all of Pub Bot\'s commands!`)
    .addField(`**Basic:**`, commands.map(command => command.name).join(', '), true)
    .addField(`**Music:**`, music.map(music => music.name).join(', '), true)
    .addField(`**Admin Only:**`, adminCommands.map(command => command.name).join(', '), true)
    .addField('Invite me to another server!', `[Click here](https://bit.ly/30G7j6Z)`)
    .addField(`Reply with ${prefix}help [command name] for more info!`, '\u200b')
    .setFooter(`Pub Bot created by SirCen#0113`);
    if (!args.length) {
      return message.author.send(embed)
	       .then(() => {
		         if (message.channel.type === 'dm') {
               return;
            }
		        message.reply('I\'ve sent you a DM with all my commands!');
	       })
	       .catch(error => {
		         console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
		         message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
	       });
    }
    const name = args[0].toLowerCase();
    const command = commands.get(name);
    const adminCommand = adminCommands.get(name);
    const musicCommand = music.get(name);
    if (command) {
      let commandEmbed = new RichEmbed()
      .setTitle(`**${command.name}**`)
      .setDescription(`**${command.description}**`)
      .addField(`**Usage:**`, `${prefix}${command.name} ${command.usage}`)
      .setColor('#F6C101');
      return message.channel.send(commandEmbed);
    }else if (adminCommand) {
      let acommandEmbed = new RichEmbed()
      .setTitle(`**${adminCommand.name}**`)
      .setDescription(`**${adminCommand.description}**`)
      .addField(`**Usage:**`, `${prefix}${adminCommand.name} ${adminCommand.usage}`)
      .setColor('#F6C101');
      return message.channel.send(acommandEmbed);
    } else if (musicCommand) {
      let musicCommandEmbed = new RichEmbed()
      .setTitle(`**${musicCommand.name}**`)
      .setDescription(`**${musicCommand.description}**`)
      .addField(`**Usage:**`, `${prefix}${musicCommand.name} ${musicCommand.usage}`)
      .setColor('#F6C101');
      return message.channel.send(musicCommandEmbed);
    }
    return;
	}
};
