const PapagoApi = require('../../api/papagoAPI.js');
const { RichEmbed } = require('discord.js');
const langs = require('../../utils/langs.js');

module.exports = {
    name: 'papago',
    aliases: ['p','ppg','trans'],
    description: 'Translate using papago, (default: en>ko)',
    args: true,
    usage: 'en>ko Example Word',
    execute(message, args) {
        let source = '';
        let target ='';

        const tarLang = args[0].split('>');
        if(tarLang.length == 2) {
            source = tarLang[0];
            target = tarLang[1];
            args.shift();
        }

        if (!langs[source] || !langs[target]) {
            return message.channel.send(`Please enter a valid language combination. Available are: ko: 'Korean', en: 'English', 'zh-CN': 'Chinese', 'zh-TW': 'Taiwanese', fr: 'French', vi: 'Vietnamese', ja: 'Japanese',`);
        }

        if (source == target) {
            return message.channel.send('Source and Target languages must be different');
        }

        if (!args.length) {
            return message.channel.send('Enter text to be translated');
        }

        const input = args.join(' ');
        const ppg = new PapagoApi();
        const promise = ppg.translate(input, source, target);

        function send(result) {
            const embed = new RichEmbed()
            .setColor('#008080')
            .setDescription(`Translation of '${input}'`)
            .setFooter('Powered by Papago')
            .addField('Result', result.text)
            .addField('Source Language', langs[result.source], true)
            .addField('Target Lanuage', langs[result.target], true);
            message.channel.send(embed);
        }

        promise.then((result) => {
            send(result);
        }, (err) => {
            throw new Error(err);
        });
    }
}