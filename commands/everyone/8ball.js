module.exports = {
  name: '8ball',
  description: 'Replies with 8ball replies',
  args: true,
  usage: '<question to be asked>',
  execute(message, args) {
    var rand = Math.floor(Math.random()*20);
    const ballAnswers = ["It is certain", "It is decidedly so", "Without a doubt", "Yes, definitely", "You may rely on it",
                      "As I see it, yes", "Most likely", "Outlook good", "Yes", "All signs point to yes",
                      "Reply hazy, try again", "Ask again later", "Better not tell you now", "Cannot predict now",
                      "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no",
                      "Outlook not so good", "Very doubtful"];
    const data = [];
    let question = "";
    for(const a of args) {
      question += a + " ";
    }
    return message.channel.send({embed: {
      color: 10761451,
      title: "Magic 8Ball",
      fields: [{
        name: `**` + message.author.username + ` Asked: **`,
        value: question,
        },
        {
        name: `**Magic 8Ball says: **`,
        value: ballAnswers[rand],
        }
      ]
    }
    });
  }
}
