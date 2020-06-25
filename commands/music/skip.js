module.exports = {
    name: "skip",
    description: "Skips the current song",
    args: false,
    async execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!message.member.voiceChannel) {
            return message.channel.send('You must be in a voice channel to skip!');
        }
        if (!serverQueue) {
            return message.channel.send('There is no song to skip!');
        }
        message.channel.send(`Skipping: **${serverQueue.songs[0].title}**`);
        await serverQueue.connection.dispatcher.end();
    }
};