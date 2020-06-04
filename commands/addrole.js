const Discord = require('discord.js');
const Tools = require('../sql/databaseTools.js');
const permissions = new Discord.Permissions("MANAGE_GUILD");

const tools = new Tools();
module.exports = {
    name: 'addrole',
    description: 'Adds a role to be automattically added to users when they join',
    args: true,
    usage: '<role name to be added on user join>',
    execute(message, args) {
        const tagName = args.join(' ');
      if (message.member.hasPermission(permissions)) {
        return tools.addRole(tagName, message);
      } return message.channel.send('You do not have permission for this command.');
    }
  };