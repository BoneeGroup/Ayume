const { Client, Options, Collection, Permissions } = require("discord.js")
const Util = require("./Utils")
const LavalinkManager = require("../Music/LavalinkManager")

module.exports = class extends Client {
	constructor(options = {}) {
		super({
			shardCount: 2,
			intents: 4737,
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
			},
			makeCache: Options.cacheWithLimits({
				UserManager: 1,
				GuildEmojiManager: 0,
				StageInstanceManager: 0,
				ThreadMemberManager: 0,
				GuildBanManager: 0,
				ApplicationCommandManager: 0,
				ApplicationCommandPermissionsManager: 0,
				GuildApplicationCommandManager: 0,
				GuildEmojiRoleManager: 0,
				GuildInviteManager: 0
			})
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
		this.prefix = options.prefix
		
		if (!options.defaultPerms) throw new Error("Defina as permissoes")
		this.defaultPerms = new Permissions(options.defaultPerms).freeze()
	}


	async connect(token = this.token) {
		await this.utils.loadCommands()
		await this.utils.loadEvents()
		await super.login(token).catch(console.log)
	}
}