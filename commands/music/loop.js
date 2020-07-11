module.exports = {
    name: "loop",
    description: "Loops the current song",
    args: true,
    usage: '<t to loop, f to stop loop>',
    async execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!message.member.voiceChannel) {
            return message.channel.send('You must be in a voice channel to loop!');
        }
        if (!serverQueue) {
            return message.channel.send('There is no song to loop!');
        }
        
        if (args == 't') {
            serverQueue.loop = true;
            return message.channel.send(`Looping: **${serverQueue.songs[0].title}**`);
        } else if (args == 'f') {
            serverQueue.loop = false;
            return message.channel.send(`Stopped looping: **${serverQueue.songs[0].title}**`);
        }
    }
};