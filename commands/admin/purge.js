const Discord = require('discord.js');
const permissions = new Discord.Permissions("MANAGE_GUILD","MANAGE_MESSAGES");

module.exports = {
    name: 'purge',
    description: 'Deletes up to 100 messages, no messages older than 14 days will be deleted.',
    args: true,
    usage: '<amount of messages to be deleted>',
    async execute(message, args) {
        const amount = args.join(' ');
        if (message.member.hasPermission(permissions)) {
            if (isNaN(amount)) {
                return message.channel.send('Please provide a number!');
            }
            if (amount > 100 || amount < 1) {
                return message.channel.send('Provide a number between 1 and 100');
            }
            await message.channel.fetchMessages({limit: amount}).then(messages => {
                message.channel.bulkDelete(messages)
            }).catch(error => {return;});
        } else { 
          return message.channel.send('You do not have permission for this command.');
        }
    } 
};