const KrDicApi = require('../../api/koreanDictAPI.js');
const PageCreator = require('../../utils/pageCreator');
const { RichEmbed } = require('discord.js');

module.exports = {
    name: 'word',
    description: 'Search for any word in the Korean Dictionary',
    args: true,
    usage: '<Word to be Searched>',
    execute(message, args) {
        const isDm = message.channel.type !== 'text';
        const input = args.join(' ');
        const api = new KrDicApi();
        const promise = api.searchWords(input, 5, 7);

        function send(result, answerMessage) {
            const englishEmbed = WordSearchEmbed('en', input, message.author.username, isDm, result);
            const koreanEmbed = WordSearchEmbed('ko', input, message.author.username, isDm, result);
            if (result.length === 0) {
                answerMessage.edit(englishEmbed);
                return;
            }
            const pages = [englishEmbed, koreanEmbed];
            const pageCreator = new PageCreator(message.author, pages, '🇬🇧', '🇰🇷', false, true, 'You can no longer switch languages. Anyone can still bookmark this message.');
            pageCreator.start(answerMessage);
        }

        const pendingEmbed = new RichEmbed()
        .setDescription(`Looking over my books for ${message.author.username} :eyes:`)
        .setColor('#008080')
        .setAuthor('Pub Bot');

        message.channel.send(pendingEmbed).then((answerMessage) => {
            promise.then((result) => {
                console.log(result);
                send(result, answerMessage);
            }, (err) => {
                throw new Error(err);
            });
        });

        function WordSearchEmbed(language, query, username, isDM, searchResults) {
            const embed = new RichEmbed()
            .setColor('#008080')
            .setAuthor('Pub Bot')
            .setDescription(`Search results for **${query}**`);
            if (searchResults.length === 0) {
                embed.addField('Error', 'No results found');
            } else {
                embed.setFooter(`${username} can toggle languages. ${!isDM ? 'Anyone can bookmark this message!' : ''}`);
                searchResults.forEach((entry) => {
                    const defs = [];
                    if (entry.senses) {
                        for (let j = 0; j < entry.senses.length; j++) {
                            const sense = entry.senses[j];
                            let d;
                            if (language === 'en') {
                                d = `${j+1}.__${sense.meaning}__\r\n${sense.translation}`;
                            } else if (language === 'ko') {
                                d = `${j+1}.__${sense.meaning}__\r\n${sense.definition}`;
                            }
                            if (`${defs.join('\n')}\n${d}`.length < 1024) {
                                defs.push(d);
                            }
                        }
                    }
                    if (language === 'en') {
                        embed.addField(`**${entry.word}**${entry.hanja ? ` (${entry.hanja})` : ''} - ${entry.wordTypeTranslated}${entry.pronouncitation ? ` - [${entry.pronouncitation}]` : ''}${entry.stars > 0 ? ' ' + '★'.repeat(entry.stars): ''}`, defs.join('\n'));
                    } else if (language === 'ko') {
                        embed.addField(`**${entry.word}**${entry.hanja ? ` (${entry.hanja})` : ''} - ${entry.wordType}${entry.pronouncitation ? ` - [${entry.pronouncitation}]` : ''}${entry.stars > 0 ? ' ' + '★'.repeat(entry.stars): ''}`, defs.join('\n'));
                    }
                });
            }
            return embed;
        }
    }
}