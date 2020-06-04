const Discord = require('discord.js');
const Tools = require('../sql/databaseTools.js');
const permissions = new Discord.Permissions("MANAGE_GUILD");

const tools = new Tools();
module.exports = {
    name: 'removerole',
    description: 'Removes the current auto role on user join',
    args: false,
    execute(message) {
      if (message.member.hasPermission(permissions)) {
        return tools.removeRole(message);
      } return message.channel.send('You do not have permission for this command.');
    }
  };