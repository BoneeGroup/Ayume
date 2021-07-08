const { Client, Collection, Permissions } = require("discord.js-self")
const Util = require("./Utils")
const LavalinkManager = require("../Music/LavalinkManager")

module.exports = class extends Client {
	constructor(options = {}) {
		super({
			messageCacheLifetime: 0,
			shardCount: 2,
			messageSweepInterval: 0,
			messageCacheMaxSize: 0,
			intents: [
				"GUILDS",
				"GUILD_MESSAGES",
				"GUILD_VOICE_STATES",
				"GUILD_MESSAGE_REACTIONS"
			],
			partials: [
				"MESSAGE",
                "CHANNEL",
                "REACTION"
			],
			restTimeOffset: 0,
			allowedMentions: {
				parse: [
					"users", 
					"roles"
				]
			}
		})
		
		this.validate(options)

		this.commands = new Collection()

		this.aliases = new Collection()

		this.events = new Collection()

		this.music = new LavalinkManager(this)

		this.utils = new Util(this)

		this.owners = options.owners

	}

	validate(options) {
		if (typeof options !== "object") throw new TypeError("As opçoes so podem ser objetos")

		if (!options.token) throw new Error("Defina um token")
		this.token = options.token;

		if (!options.prefix) throw new Error("Defina um prefix")
		if (typeof options.prefix !== "string") throw new TypeError("Prefix apenas string")
		this.prefix = options.prefix.toLowerCase()
		
		if (!options.defaultPerms) throw new Error("Defina as permissoes")
		this.defaultPerms = new Permissions(options.defaultPerms).freeze()
	}


	async connect(token = this.token) {
		await this.utils.loadCommands()
		await this.utils.loadEvents()
		await super.login(token).catch(e => console.log(e))
	}
}