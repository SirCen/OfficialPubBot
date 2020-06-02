const Sequelize = require('sequelize');

module.exports = class Tools {
    constructor() {
        //database
        //connect
        const sequelize = new Sequelize('database', 'user', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
            storage: 'sql/database.sqlite'
        });

        //create table with columns guildID and role
        this.Tags = sequelize.define('tags', {
            guildID: {
            type: Sequelize.STRING,
            unique: true
            },
            role: {
            type: Sequelize.STRING,
            get : function() {
                var name = this.getDataValue('role');
                return name;
            }
            }
        });
        
        // create table with columns of GuildId, channelID, and bool disabled
        this.ComDisabled = sequelize.define('comDisable', {
            guildID : {
            type: Sequelize.STRING
            },
            channelID : {
            type: Sequelize.STRING,
            unique: true
            },
            imDisabled : {
            type: Sequelize.INTEGER,
            defaultValue: 0
            }
        });
    }
    async addRole(tagName, message) {
        try {
            // equivalent to: INSERT INTO tags (guildID, role) values (?, ?);
            const tag = await this.Tags.create({
                guildID: message.guild.id,
                role: tagName,
            });
            return message.channel.send(`Role ${tag.role} added.`);
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.channel.send('Role already added, to edit use \"editar\"' );
            }
            console.log(e);
            return message.channel.send('Something went wrong with adding a role.');
        }
    }

    async editRole(tagName, message) {
        try {
            const tag = await this.Tags.update({ role: tagName }, { where: { guildID: message.guild.id } });
            if (tag > 0) {
                return message.channel.send(`Role changed to ${tagName}`);
            }return message.channel.send(`Could not find role with name: ${tagName}.`);
        }catch (e) {
            console.log(e);
            return message.channel.send('Something went wrong');
        }
    }

    async currentRole(message) {
        try {
            const tag = await this.Tags.findOne({where: { guildID: message.guild.id } });
            if (tag) {
                return message.channel.send(`Current Role set: ${tag.role}`);
            } return message.channel.send(`No role set! Use 'addrole' to set a role!`);
        }catch (e) {
            console.log(e);
            return message.channel.send(`Something went wrong!`);
        }
    }

    async removeRole(message) {
        try {
            const tag = await this.Tags.destroy({where: { guildID : message.guild.id}});
            if (!tag) {
                return message.channel.send('No role assigned to server.');
            }return message.channel.send('AutoRole removed.');
        } catch (e) {
            if(e.name === 'SequelizeUniqueConstraintError') {
                return;
            }return message.channel.send('Something went wrong!');
        }
    }
};