const { prefix } = require('../../config.json');
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
    const { commands, adminCommands, music } = message.client;

    if (!args.length) {
      data.push(`**Commands:**`);
      data.push(`•` + commands.map(command => command.name).join(`\n•`));
      data.push(`**Music Commands**`);
      data.push(`•` + music.map(music => music.name).join('\n•'));
      data.push(`**Admin Only Commands:**`);
      data.push(`•` + adminCommands.map(command => command.name).join('\n•'));
      data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
			data.push('\n');
			data.push('Invite me to another server! --> https://bit.ly/30G7j6Z')
      return message.author.send(data, { split: true })
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
    if (command) {   
      data.push(`**Name:** ${command.name}`);
      if (command.description) {
        data.push(`**Description:** ${command.description}`);
      }
      if (command.usage) {
        data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
      }
      data.push(`**Cooldown:** 3 second(s)`);
      return message.channel.send(data, { split: true });
    }else if (adminCommand) {
      data.push(`**Name:** ${adminCommand.name}`);
      if (adminCommand.aliases) {
        data.push(`**Aliases:** ${adminCommand.aliases.join(', ')}`);
      }
      if (adminCommand.description) {
        data.push(`**Description:** ${adminCommand.description}`);
      }
      if (adminCommand.usage) {
        data.push(`**Usage:** ${prefix}${adminCommand.name} ${adminCommand.usage}`);
      }
      data.push(`**Cooldown:** ${adminCommand.cooldown || 3} second(s)`);
      return message.channel.send(data, { split: true });
    }
    return;
	}
};
