const { RichEmbed } = require("discord.js");

module.exports = {
    name: 'pubbrawl',
    description: 'Starts a 1v1 between command user and random member',
    aliases: ['deathbattle', 'fight', '1v1', 'onevsone'],
    usage: '',
    args: false,
    async execute(message, args) {
        var user1 = message.author;
        var user2 = await message.guild.members.random().user;
        var user1Health = 100; 
        var user2Health = 100;
        let weapon = ['stabbed', 'set fire to', 'shot', 'curb stomped', 'sliced', 'punched', 'kicked', 'choke slammed', 'RKO\'ed', 'waterboarded', 'bitch slapped', 'backhanded', 'tackled', 'hip threw', 'elbow dropped'];
        let damage = Math.floor(Math.random()*24)+1;
        let rand = Math.floor(Math.random()*weapon.length);
        let embed = fightEmbed(user1, user2, user1Health, user2Health, weapon[rand], damage);
        let count = 1;

        function fightEmbed(user1, user2, user1Health, user2Health, weapon, damage) {
            let newEmbed = new RichEmbed()
            .setTitle(`A BRAWL STARTED BETWEEN **${user1.username}** AND **${user2.username}**!`)
            .addField(`${user1.username}`, user1Health + '/100', true)
            .addField(`${user2.username}`, user2Health + '/100', true);
            return newEmbed;
        }

        function winnerEmbed(winner, loser, user1Health, user2Health) {
            let win = new RichEmbed()
            .setDescription(`:trophy: ${winner.username} HAS DEFEATED ${loser.username}!`)
            .addField(`${winner.username}`, `${user1Health}/100`, true)
            .addField(`${loser.username}`, `${user2Health}/100`, true);
            return win;
        }

        message.channel.send(embed)
        .then((msg) => {
            setInterval(function() {
                if(user1Health > 0 && user2Health > 0) {
                    let damage = Math.floor(Math.random()*25);
                    let rand = Math.floor(Math.random()*weapon.length);
                    if (count%2 == 0) {
                        user2Health = user2Health - damage;
                        msg.edit(fightEmbed(user1, user2, user1Health, user2Health, weapon[rand], damage)
                        .setDescription(`:arrow_right: __${user1.username}__ ` + weapon[rand] + ` __${user2.username}__ for ` + `__${damage}__ dmg`));
                        count++;
                    } else {
                        user1Health = user1Health - damage;
                        msg.edit(fightEmbed(user1, user2, user1Health, user2Health, weapon[rand], damage)
                        .setDescription(`:arrow_right: __${user2.username}__ ` + weapon[rand] + ` __${user1.username}__ for ` + `__${damage}__ dmg`));
                        count++;
                    }
                    
                }else if (user1Health <= 0) {
                    msg.edit(winnerEmbed(user2, user1, user2Health, user1Health));
                    return;
                } else if (user2Health <= 0) {
                    msg.edit(winnerEmbed(user1, user2, user1Health, user2Health));
                    return;
                }
                return;
            }, 2000)
        });
    }
}