const { RichEmbed } = require("discord.js");

module.exports = {
    name: 'pubbrawl',
    description: 'Starts a 1v1 between command user and random member',
    aliases: ['deathbattle', 'fight', '1v1', 'onevsone'],
    usage: '',
    async execute(message, args) {
        let ment = message.mentions.users.first();
        var user1 = message.author;
        var user2;
        if (!ment) {
            user2 = await message.guild.members.random().user;
        } else {
            user2 = message.mentions.users.first();
        }
        var user1Health = 50; 
        var user2Health = 50;
        let weapon = ['stabbed', 'set fire to', 'shot', 'curb stomped', 'sliced', 'punched', 'kicked', 'choke slammed', 'RKO\'ed', 'waterboarded', 'bitch slapped', 'backhanded', 'tackled', 'hip threw', 'elbow dropped'];
        let damage = Math.floor(Math.random()*24)+1;
        let rand = Math.floor(Math.random()*weapon.length);
        let embed = fightEmbed(user1, user2, user1Health, user2Health, weapon[rand], damage);
        let count = 1;

        function fightEmbed(user1, user2, user1Health, user2Health) {
            let newEmbed = new RichEmbed()
            .setTitle(`A BRAWL STARTED BETWEEN **${user1.username}** AND **${user2.username}**!`)
            .addField(`${user1.username}`, user1Health + '/50HP', true)
            .addField(`${user2.username}`, user2Health + '/50HP', true);
            return newEmbed;
        }

        message.channel.send(embed)
        .then((msg) => {
            setInterval(function() {
                if(user1Health > 0 && user2Health > 0) {
                    let damage = Math.floor(Math.random()*25)+1;
                    let rand = Math.floor(Math.random()*weapon.length);
                    if (count%2 == 0) {
                        user2Health = user2Health - damage;
                        msg.edit(fightEmbed(user1, user2, user1Health, user2Health)
                        .setDescription(`:arrow_right: __${user1.username}__ ` + weapon[rand] + ` __${user2.username}__ for ` + `__${damage}__ dmg`));
                        count++;
                    } else {
                        user1Health = user1Health - damage;
                        msg.edit(fightEmbed(user1, user2, user1Health, user2Health)
                        .setDescription(`:arrow_right: __${user2.username}__ ` + weapon[rand] + ` __${user1.username}__ for ` + `__${damage}__ dmg`));
                        count++;
                    }
                    
                }else if (user1Health <= 0) {
                    msg.edit(fightEmbed(user1, user2, user1Health, user2Health).setDescription(`:trophy: ${user2.username} HAS DEFEATED ${user1.username}!`));
                    return;
                } else if (user2Health <= 0) {
                    msg.edit(fightEmbed(user1, user2, user1Health, user2Health).setDescription(`:trophy: ${user1.username} HAS DEFEATED ${user2.username}!`));
                    return;
                }
                return;
            }, 3000)
        });
    }
}