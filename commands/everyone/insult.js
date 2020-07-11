module.exports = {
    name: 'insult',
    args: true,
    description: `Insults the user that is tagged **18+**`,
    usage: '<Tagged User>',
    execute(message, args) {
        let insults = ['noodle head lookin ass', 'sandwich with no bread lookin ass', 'prick.', 'fuck off you twat', 'fuck off', 'your mum bought you mega blocks instead of legos',
                        'ye mum gey', 'ya da sells avon', 'hope you step on lego', '개 새끼야!', '씨발', '18', 'you a smol boy', 'ya haircut looks like lego', 'you put the milk first in tea',
                        'you put milk before cereal', 'your booty looks like an inverted bowl', 'ya girl\'s ass is flatter than drywall', 'you lost your chance as soon as you left the womb',
                        'Why don\'t you shut the fuck up you weasly fucking bragging wanker of a cunt. Nobody gives a flying fuck about you, your life or your dreams. So either you shut that trap of yours or go fuck yourself in that shithole of the mother you came from',
                        'you meanie', 'bet you aint even got airpods', 'bet you get drunk off half a shot, you lightweight', 'There are approximately 1010300 words in the English language, but I could never string enough words together to properly explain how much I want to hit you with a chair.',
                        'Away, you three-inch fool!', 'cunt', 'shut up you simp', 'go simp somewhere else', 'boomer', 'You\'re about as much use as a condom machine in the Vatican', 'Your mother was a hamster and your father smelt of elderberries',
                        'if you were the trophy at the end of a race, i would walk backwards', 'koala headass', 'cuntmuffin', 'wanker', 'shut up you muppet', 'bitch.', 'you aint even worth an insult', 
                        'even a blind person would find you ugly', '이 자식아', 'your mum got no job', 'you fool. you absolute moron. you are such a monumental idiot that you don\'t even realize what you just said. i am a verbal magician and you, my friend, are a naive simpleton. your family line deserves to die with you',
                        'shut up, youre like 12', 'you look like the first half of an antidepressant commercial', 'bet you only know romanised korean', 'is the kind of dude to get offended by a word and leave the discord'];
        var rand = Math.floor(Math.random() * insults.length);
        let tagged = message.mentions.users.first();
        if (tagged == message.client.user) {
            return message.reply(insults[rand]);
        }
        if (tagged) {
            return message.channel.send(tagged + ' ' + insults[rand]);
        } else {
            return message.channel.send('Please tag the person to be insulted!');
        }
    }
}