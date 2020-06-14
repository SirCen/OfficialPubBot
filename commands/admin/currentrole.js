const Discord = require('discord.js');
const Tools = require('../../sql/databaseTools.js');
const permissions = new Discord.Permissions("MANAGE_GUILD");

const tools = new Tools();
module.exports = {
    name: 'currentrole',
    description: 'Sends a message of the current assigned role to be added on user join',
    args: false,
    execute(message) {
      if (message.member.hasPermission(permissions)) {
        return tools.currentRole(message);
      } return message.channel.send('You do not have permission for this command.');
    }
  };