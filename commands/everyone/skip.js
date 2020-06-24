const ytdl = require('ytdl-core');

module.exports = {
    name: "skip",
    description: "Skips the current song",
    args: false,
    usage: '<skips current song playing>',
    async execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!message.member.voiceChannel) {
            return message.channel.send('You must be in a voice channel to skip!');
        }
        if (!serverQueue) {
            return message.channel.send('There is no song to skip!');
        }
        serverQueue.connection.dispatcher.end();
    }
};