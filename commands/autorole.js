const fs = require('fs');
module.exports = {
  name: 'autorole',
  description: 'Allows them to set role to be auto added',
  args: true,
  usage: '<role to be assigned automatically on join>',
  execute(message, args) {
    let customRole = message.content.slice(9).split(' ');
    fs.writeFile(`roles.json`, customRole, (err) => {
      if (err) {
        console.error(err);
      }
    })
  }
};
