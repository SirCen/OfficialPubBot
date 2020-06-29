const ytdl = require('ytdl-core');

module.exports = {
    name: "play",
    description: "Plays the song in voice channel",
    args: true,
    usage: '<song name or link>',
    async execute(message, args) {
        try {
            const queue = message.client.queue;
            const serverQueue = message.client.queue.get(message.guild.id);
            const voiceChannel = message.member.voiceChannel;

            if (!voiceChannel) {
                return message.channel.send("You need to be in a voice channel to play music!");
            }
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                return message.channel.send("I need permissions to join and speak in your voice channel!");
            }
            if (!ytdl.validateID(args[0]) && !ytdl.validateURL(args[0])) {
                return message.channel.send("Currently can only play using link or ID!");
            }
            const songInfo = await ytdl.getInfo(args[0]);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url
            };

            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 1,
                    playing: true, 
                    loop: false
                };

                queue.set(message.guild.id, queueConstruct);

                queueConstruct.songs.push(song);

                try {
                    var connection = await voiceChannel.join();
                    queueConstruct.connection = connection;
                    this.play(message, queueConstruct.songs[0]);
                } catch (err) {
                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send("An Error Occured Playing That Song");
                }
            } else {
                serverQueue.songs.push(song);
                return message.channel.send(`**${song.title}** was added to the queue!`);
            }
        } catch (error) {
            console.log(error);
            message.channel.send("Error Occured Adding Song");
        }
    },

    async play(message, song) {
        const queue = message.client.queue;
        const guild = message.guild;
        const serverQueue = queue.get(message.guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }

        const dispatcher = await serverQueue.connection
        .playStream(ytdl(song.url, {highWaterMark: 1<<25 }))
        .on("end", () => {
            if (serverQueue.loop) {
                this.play(message, serverQueue.songs[0]);
            } else {
                serverQueue.songs.shift();
                this.play(message, serverQueue.songs[0]);
            }
        })
        .on("error", error => console.log(error));

        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Started playing: **${song.title}**`);
    }
};