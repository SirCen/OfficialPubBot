let weather = require('weather-js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'weather',
    description: 'returns the weather in a given location',
    usage: '<degree type> <location>',
    execute(message, args) {
        // let degree = args.shift();
        // let location = args.join(' ');
        // weather.find({search: location, degreeType: degree}, function(err, result) {
        //     if (err) {
        //         return message.channel.send("Could not find that location, please try again");
        //     }
        //     let current = result[0].current;
        //     let foundLocation = result[0].location;
        //     const embed = new MessageEmbed()
        //     .setDescription(`**${current.skytext}**`)
        //     .setAuthor(`Weather for ${current.observationpoint}`)
        //     .setThumbnail(current.imageUrl)
        //     .setColor('#F6C101')
        //     .addField('Timezone', `UTC${foundLocation.timezone}`, true)
        //     .addField('Current Time', `${current.observationtime}`, true)
        //     .addField('Temperature', `${current.temperature}${foundLocation.degreetype}`, true)
        //     .addField('Feels Like', `${current.feelslike}${foundLocation.degreetype}`, true)
        //     .addField('Wind', current.winddisplay, true)
        //     .addField('Humidity', `${current.humidity}%`, true);

        //     return message.channel.send(embed);
        return message.channel.send('Currently Not Working');
        }
    }