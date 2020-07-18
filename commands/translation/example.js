const SentenceExampleAPI = require('../../api/sentenceExampleAPI.js');
const { RichEmbed } = require('discord.js');

module.exports = {
    name: 'example',
    description: 'Searches the dictionary for example sentences',
    usage: '<word to be used in example sentences>',
    args: true,
    execute(message, args) {
        const q = args.join(' ');
        const api = new SentenceExampleAPI();
        const promise = api.searchExamples(q, message);

        function send(dicEntries, answerMessage) {
            const exampleEmbed = ExampleEmbed(q, dicEntries);
            if (dicEntries.length === 0) {
                answerMessage.edit(exampleEmbed);
                return;
            }
            answerMessage.edit(exampleEmbed);
        }

        const pendingEmbed = new RichEmbed()
        .setDescription(`Looking over my books for ${message.author.username} :eyes:`)
        .setColor('#008080')
        .setAuthor('Pub Bot');

        message.channel.send(pendingEmbed).then((answerMessage) => {
            promise.then((result) => {
                send(api.parseExampleResult(result), answerMessage);
            }, (err) => {
                throw new Error(err);
            });
        });

        function ExampleEmbed(query, searchResults) {
            const embed = new RichEmbed()
            .setDescription(`Example Sentences for for: **${query}**`)
            .setColor('#008080')
            .setAuthor('Pub Bot');
            if (searchResults.length === 0) {
              embed.addField('Error', 'No results have been found');
            } else {
              let sentence = `Example sentences for **${query}**:\r\n\r\n`;
              let i;
              for (i = 0; i < searchResults.length; i += 1) {
                sentence += `**${i + 1}.** ${searchResults[i].example.replace(query, `**__${query}__**`)}\r\n\r\n`;
              }
              embed.setDescription(sentence);
            }
            return embed;
        }
    }
}