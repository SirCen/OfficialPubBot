const Discord = require('discord.js');
const Tools = require('../../sql/databaseTools.js');
const permissions = new Discord.Permissions("MANAGE_GUILD");

const tools = new Tools();
module.exports = {
    name: 'editrole',
    description: 'Changes the current autorole to new role',
    args: true,
    usage: '<role to be assigned as autorole>',
    execute(message, args) {
        const tagName = args.join(' ');
        if (message.member.hasPermission(permissions)) {
            return tools.removeRole(tagName, message);
        } return message.channel.send('You do not have permission for this command.');
    }
  };