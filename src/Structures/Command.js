const { Permissions } = require('discord.js');

module.exports = class Command {

	constructor(client, name, options = {}) {
		this.client = client
		this.name = options.name || name
		this.aliases = options.aliases || []
		this.description = options.description || 'Sem descrição'
		this.category = options.category || 'Outros'
		this.usage = options.usage || ''
		this.userPerms = new Permissions(options.userPerms).freeze()
		this.botPerms = new Permissions(options.botPerms).freeze()
		this.enabled = options.enabled || true
		this.ownerOnly = options.ownerOnly || false
		this.args = options.args || false
		this.guildOnly = options.guildOnly || true
	}

	// eslint-disable-next-line no-unused-vars
	async run({ message, args }, lang) {
		throw new Error(`Faltou o jeito de rodar o comando ${this.name}`);
	}
}