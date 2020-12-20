const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "playlist",
    description: "Shows all the songs in the queue",
    args: false,
    usage: '',
    execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) {
            return message.channel.send('There are no songs in playlist!');
        }
        var queueEmbed = new MessageEmbed();
        queueEmbed.setColor("GREEN").setTitle("Current Playlist");
        for (let i = 0; i < serverQueue.songs.length; i++) {
            if (i > 9) {
                break;
            }
            queueEmbed.addField(`${i+1}:`, `${serverQueue.songs[i].title}`);
        }
        return message.channel.send(queueEmbed);
    }
};