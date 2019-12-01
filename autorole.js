const fs = require('fs');
var bot = require('../bot.js');
module.exports = {
  name: 'autorole',
  description: 'Allows them to set role to be auto added',
  args: true,
  usage: '<role to be assigned automatically on join>',
  execute(message, args) {
    // var jsonPath = './roles.json';
    // var jsonRead = fs.readFileSync(jsonPath);
    // var jsonFile = JSON.parse(JSON.stringify(jsonRead));
    // let customRole = message.content.substring(10);
    // let guildRole = {"role": customRole};
    // var myJson = '"' + message.guild.id + '"' + ":" + JSON.stringify(guildRole, null, 2);
    // fs.appendFile("./roles.json", myJson, (err) => {
    //   if (err) throw err;
    //   console.log('success');
    // });
    let customRole = message.content.substring(10);
    const tag = bot.Tags.create({
      guildID: message.guild.id,
      role: customRole
    });
  }
}
