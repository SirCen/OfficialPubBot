const Discord = require('discord.js');
const permissions = new Discord.Permissions("MANAGE_GUILD","KICK_MEMBERS");

module.exports = {
    name: 'kick',
    description: 'Kicks the mentioned user',
    args: true,
    usage: '<member to be kicked> <reason for kick>',
    async execute(message, args) {
        const user = message.mentions.users.first();
        const kickReason = args.slice(1).join(' ');
        if (message.member.hasPermission(permissions)) {
            if (!user) { return; }
            if (user === message.author) {
                return message.channel.send('You can not kick yourself!');
            }
            if(!kickReason) {
                return message.channel.send('You need to add a reason!');
            }
            if(!message.guild.member(user).kickable) {
                return message.channel.send('I do not have permission to kick this member!');
            }
            await message.guild.member(user).kick(kickReason);
            const kickConfirmation = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`✅ ${user.tag} has been successfully kicked!`);
            return message.channel.send({embed: kickConfirmation});
        } return message.channel.send('You do not have permission for this command.');
    } 
};