const Discord = require('discord.js');
const permissions = new Discord.Permissions("MANAGE_GUILD","BAN_MEMBERS");

module.exports = {
    name: 'ban',
    description: 'Bans the mentioned user',
    args: true,
    usage: '<member to be banned> <reason for ban>',
    async execute(message, args) {
        const user = message.mentions.users.first();
        let banReason = args.slice(1).join(' ');
      if (message.member.hasPermission(permissions)) {
        if (!user) {
            try {
                if (!message.guild.members.get(args.slice(0,1).join(' '))) {
                    return message.channel.send('Couldn\'t get member with that tag!');
                }
                user = message.guild.members.get(args.slice(0,1).join(' '));
                user = user.user;
            }catch (error) {
                return message.channel.send('Couldn\'t get user with this ID!');
            }
        }
        if (user === message.author) {
            return message.channel.send('You can not ban yourself!');
        }
        if(!banReason) {
            banReason = `Banned By ${message.author.tag}`;
        }
        if(!message.guild.member(user).bannable) {
            return message.channel.send('I do not have permission to ban this member!');
        }
        await message.guild.ban(user, {reason: banReason});
        const banConfirmation = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`✅ ${user.tag} has been successfully banned!`);
        return message.channel.send({embed: banConfirmation});
      } return message.channel.send('You do not have permission for this command.');
    } 
};