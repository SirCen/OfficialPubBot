const Discord = require("discord.io");

module.exports = {
    name: 'userinfo',
    description: 'Replies with User\'s Info',
    execute(message, args) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        var sender = message.author;
        let ment = message.mentions.users.first();
        if (ment) {
            //if user mentioned
            let memb = message.guild.member(ment);
            return message.channel.send({embed: {
                color: 10761451,
                title: "User Information",
                thumbnail: {
                    url: ment.avatarURL,
                },
                fields: [
                    {
                        name: "Username: ",
                        value: memb.user.username,
                        inline: true,
                    },
                    {
                        name: "Tag: ",
                        value: ment.tag,
                        inline: true,
                    },
                    {
                        name: "Nickname: ",
                        value: memb.displayName,
                    },
                    {
                        name: "Status: ",
                        value: ment.presence.status,
                    },
                    {
                        name: "Created On: ",
                        value: ment.createdAt.toUTCString(),
                    },
                    {
                        name: "Server Joined On: ",
                        value: memb.joinedAt.toUTCString(),
                    },
                    {
                        name: "Roles: ",
                        value: memb.roles.map(r => `${r}`).join(' | '),
                    }
                ]
            }});
        } else {
            //if no args provided
            let memb = message.guild.member(message.author);
            return message.channel.send({embed: {
                color: 10761451,
                title: "User Information",
                thumbnail: {
                    url: memb.user.avatarURL,
                },
                fields: [
                    {
                        name: "Username: ",
                        value: memb.user.username,
                        inline: true,
                    },
                    {
                        name: "Tag: ",
                        value: memb.user.tag,
                        inline: true,
                    },
                    {
                        name: "Nickname: ",
                        value: memb.displayName,
                    },
                    {
                        name: "Status: ",
                        value: memb.presence.status,
                    },
                    {
                        name: "Created On: ",
                        value: message.author.createdAt.toUTCString(),
                    },
                    {
                        name: "Server Joined On: ",
                        value: memb.joinedAt.toUTCString(),
                    },
                    {
                        name: "Roles: ",
                        value: memb.roles.map(r => `${r}`).join(' | '),
                    }
                ]
            }});
        }
        
    }
  };