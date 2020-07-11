const { Client, Collection } = require('discord.js');

module.exports = class extends Client {
	constructor(config) {
		super({
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
		});

        this.commands = new Collection();
        
		this.adminCommands = new Collection();
		
		this.music = new Collection();

		this.translate = new Collection();

		this.queue = new Map();

		this.config = config;
	}
};