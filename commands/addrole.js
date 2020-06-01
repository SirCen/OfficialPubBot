const Discord = require('discord.js');
const Tools = require('../sql/databaseTools.js');
const permissions = new Discord.Permissions("MANAGE_GUILD");

const tools = new Tools();
module.exports = {
    name: 'addrole',
    description: 'Adds a role to be automattically added to users when they join',
    args: true,
    usuage: '<role name to be added on user join>',
    execute(message, args) {
        console.log(args);
        const tagName = args[0].toString();
      if (message.member.hasPermission(permissions)) {
        tools.addRole(tagName, message);
      }
    }
  };