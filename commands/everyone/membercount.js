module.exports = {
  name: 'membercount',
  description: 'Replies with member count',
  execute(message, args) {
    message.channel.send(`Total Member Count: ${message.guild.memberCount}`);
  }
};
