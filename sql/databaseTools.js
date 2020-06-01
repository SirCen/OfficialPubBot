const Sequelize = require('sequelize');

module.exports = class Tools {
    constructor() {
        //database
        //connect
        const sequelize = new Sequelize('database', 'user', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
            storage: 'database.sqlite'
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
            // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
            const tag = await this.Tags.create({
                guildID: message.guild.id,
                role: tagName,
            });
            return message.reply(`Role ${tag.role} added.`);
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.reply('Role already added, to edit use \"editar\"' );
            }
            console.log(e);
            return message.reply('Something went wrong with adding a role.');
        }
    }

    async editRole(tagName, message) {
        try {
            const tag = await tools.Tags.update({ role: tagName }, { where: { guildID: message.guild.id } });
            return message.reply(`Role changed to ${tag.role}`);
        }catch (e) {
            return message.reply('Something went wrong');
        }
    }
};