const { prefix } = require('../../config.json');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands', 'h'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
    const { commands, adminCommands, music, translate } = message.client;
    let embed = new MessageEmbed()
    .setColor("#F6C101")
    .setTitle('Pub Bot Commands!')
    .setDescription(`This is all of Pub Bot\'s commands!`)
    .addField(`**Basic:**`, commands.map(command => command.name).join(', '), true)
    .addField(`**Music:**`, music.map(music => music.name).join(', '), true)
    .addField(`**Admin Only:**`, adminCommands.map(command => command.name).join(', '), true)
    .addField(`**Translation:**`, translate.map(command => command.name).join(', '), true)
    .addField('Invite me to another server!', `[Click here](https://bit.ly/30G7j6Z)`)
    .addField(`Reply with ${prefix}help [command name] for more info!`, '\u200b')
    .setFooter(`Pub Bot created by SirCen#0113`);
    if (!args || !args.length) {
      return message.channel.send(embed);
    }
    const name = args[0].toLowerCase();
    const command = commands.get(name);
    const adminCommand = adminCommands.get(name);
    const musicCommand = music.get(name);
    const transCommand = translate.get(name);
    if (command) {
      let commandEmbed = new MessageEmbed()
      .setTitle(`**${command.name}**`)
      .setDescription(`**${command.description}**`)
      .addField(`**Usage:**`, `${prefix}${command.name} ${command.usage}`)
      .setColor('#F6C101');
      return message.channel.send(commandEmbed);
    }else if (adminCommand) {
      let acommandEmbed = new MessageEmbed()
      .setTitle(`**${adminCommand.name}**`)
      .setDescription(`**${adminCommand.description}**`)
      .addField(`**Usage:**`, `${prefix}${adminCommand.name} ${adminCommand.usage}`)
      .setColor('#F6C101');
      return message.channel.send(acommandEmbed);
    } else if (musicCommand) {
      let musicCommandEmbed = new MessageEmbed()
      .setTitle(`**${musicCommand.name}**`)
      .setDescription(`**${musicCommand.description}**`)
      .addField(`**Usage:**`, `${prefix}${musicCommand.name} ${musicCommand.usage}`)
      .setColor('#F6C101');
      return message.channel.send(musicCommandEmbed);
    } else if (transCommand) {
      let transCommandEmbed = new MessageEmbed()
      .setTitle(`**${transCommand.name}**`)
      .setDescription(`**${transCommand.description}**`)
      .addField(`**Usage:**`, `${prefix}${transCommand.name} ${transCommand.usage}`)
      .setColor('#F6C101');
      return message.channel.send(transCommandEmbed);
    }
    return;
	}
};
