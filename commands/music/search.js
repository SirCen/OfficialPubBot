const search = require('yt-search');
const Discord = require('discord.js');

module.exports = {
    name: "search",
    description: "Searches for song and displays top 10 results",
    args: true,
    usage: '<song name>',
    async execute(message, args) {
        search(args.join(' '), function(err, res) {
            if (err) {
                console.log(err);
                return message.channel.send('Something went wrong');
            }
            let videos = res.videos.slice(0,10);
            let embed = new Discord.RichEmbed();
            embed.setTitle(`Search Results for \'${args.join(' ')}\'`)
            .setColor('RED');
            for (var i in videos) {
                embed.addField(`**[${parseInt(i)+1}]:** `, `${videos[i].title}\`\n`);
            }
            embed.setFooter(`\n**Choose a number between \`1-${videos.length}\`**`);
            
            message.channel.send(embed);
            const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
            const collector = message.channel.createMessageCollector(filter);

            collector.videos = videos;
            collector.once('collect', function(m) {
                let playSong = require('./play.js');
                playSong.execute(m, [this.videos[parseInt(m.content)-1].url]);
            });
        });
    }
};