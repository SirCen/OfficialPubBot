const Discord = require('discord.js');
const Tools = require('../../sql/databaseTools.js');
const permissions = new Discord.Permissions("MANAGE_GUILD");

const tools = new Tools();
module.exports = {
    name: 'enableyurr',
    description: 'Enables \'Yurr\' response to messages',
    args: false,
    execute(message) {
      if (message.member.hasPermission(permissions)) {
        return tools.enableYurr(message);
      } return message.channel.send('You do not have permission for this command.');
    }
  };