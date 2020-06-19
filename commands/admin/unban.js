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
            // if (!user) {
            //     try {
            //         if (!message.guild.members.get(args.slice(0,1).join(' '))) {
            //             return message.channel.send('Couldn\'t get member with that tag!');
            //         }
            //         user = message.guild.members.get(args.slice(0,1).join(' '));
            //         user = user.user;
            //     }catch (error) {
            //         return message.channel.send('Couldn\'t get user with this ID!');
            //     }
            // }
            // if (user === message.author) {
            //     return;
            // }
            if(!reason) {
                reason = `Unbanned by ${message.author.tag}`;
            }
            // await message.guild.fetchBans().then(async bans => {
            //     console.log('here');
            //     if (bans.some(u => User.(u.username))) {
            //         let user = bans.find(user => user.username === User);
            //         await message.guild.unban(user.id, reason);
            //         const unbanConfirmation = new Discord.RichEmbed()
            //         .setColor('GREEN')
            //         .setDescription(`✅ ${User} has been successfully unbanned!`);
            //         return message.channel.send({embed: unbanConfirmation});
            //     } else if (bans.some(u => User.includes(u.id))) {
            //         console.log('here1');
            //         await message.guild.unban(User, reason);
            //         const unbanConfirmation = new Discord.RichEmbed()
            //         .setColor('GREEN')
            //         .setDescription(`✅ ${User.tag} has been successfully unbanned!`);
            //         return message.channel.send({embed: unbanConfirmation});
            //     } else {
            //         return message.channel.send('This person is not banned');
            //     }
            // });
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
                }
            }catch (err) {
                console.error(err);
            }
        }else {
             return message.channel.send('You do not have permission for this command.');
        }
    } 
};