module.exports = {
  name: 'hot',
  description: 'Replies with hot or not hot',
  args: true,
  usage: '<thing to be judged on hotness>',
  execute(message, args) {
      var newMessage = message.content.slice(5);
      var rand = Math.floor(Math.random()*2);
      if (rand === 0) {
        return message.channel.send(newMessage + ' is HOT! :fire:');
      }else if (rand === 1) {
        return message.channel.send(newMessage + ' is NOT HOT! :snowflake:');
      }
  }
};
