const Discord = require('discord.js');
const ban = require('./ban');
const permissions = new Discord.Permissions("MANAGE_GUILD");

module.exports = {
    name: 'unban',
    description: 'Unbans the mentioned user',
    args: true,
    usage: '<member to be unbanned> <[optional]Reason>',
    async execute(message, args) {
        let User = args[0];
        let member = User;
        let reason = args.slice(1).join(' ');
        if (message.member.hasPermission(permissions)) {
            if(!reason) {
                reason = `Unbanned by ${message.author.tag}`;
            }
            try {
                const banList = await message.guild.fetchBans();
                User = User.replace(/[\\<>@#&!]/g, "");
                const bannedUser = banList.find(user => user.id === User);
                if (bannedUser) {
                    await message.guild.unban(bannedUser);
                    const unbanConfirmation = new Discord.RichEmbed()
                    .setColor('GREEN')
                    .setDescription(`✅ ${member} has been successfully unbanned!`);
                    return message.channel.send({embed: unbanConfirmation});
                } else {
                    return message.channel.send('Could not find that user!');
                }
            }catch (err) {
                console.error(err);
            }
        }else {
             return message.channel.send('You do not have permission for this command.');
        }
    } 
};