const { Manager } = require("erela.js")
const { MessageEmbed } = require("discord.js")

require("./Player")
module.exports = class AyumeManager extends Manager {
	constructor(client, options = {}) {
		super({
			nodes: require("./Nodes"),
			autoPlay: true,
			clientName: "Ayume",
			send(id, payload) {
				const guild = client.guilds.cache.get(id)
				if (guild) guild.shard.send(payload)
			}
		})


		this.on("nodeError", (node, error) => console.log(`[NODE] - ${node.options.identifier} error: ${error.message}`.red))

		this.on("nodeConnect", (node) => console.log(`[NODE] - ${node.options.identifier} conectado`.green))

		this.on("trackStart", async (player, track) => {
			const channel = client.channels.cache.get(player.textChannel)
			let lang = db.get(`${player.options.guild}_lang`) || "pt-BR"
			if (lang === "en-US") lang = client.lang.en
			if (lang === "pt-BR") lang = client.lang.pt

			if (player.get("interaction")) {
				let embed = new MessageEmbed()
				embed.setColor(client.guilds.cache.get(player.options.guild).me.roles.highest.color || client.settings.color)

				if (track.title == "Animu FM is a Brazilian otaku radio focused on animesongs, vocaloid, Japanese rhythm games, Brazillan fansings, and Brazilian openings and closings") {
					embed.setDescription(lang.events.music.radio)
				} else {
					embed.setDescription(`<:mp3:845373024713703434> | ${lang.events.music.playingNow} **${track.title}**`)
				}

				player.get("interaction").reply({ embeds: [embed] }).then(msg => {
					player.set("interaction", null)
					player.set("message", msg)
				})
			} else {
				let embed = new MessageEmbed()
				embed.setColor(client.guilds.cache.get(player.options.guild).me.roles.highest.color || client.settings.color)

				if (track.title == "Animu FM is a Brazilian otaku radio focused on animesongs, vocaloid, Japanese rhythm games, Brazillan fansings, and Brazilian openings and closings") {
					embed.setDescription(lang.events.music.radio)
				} else {
					embed.setDescription(`<:mp3:845373024713703434> | ${lang.events.music.playingNow} **${track.title}**`)
				}
				return channel.send({ embeds: [embed] }).then((msg) => player.set("message", msg))
			}
		})

		this.on("trackEnd", (player) => {
			if (player.get("message") && !player.get("message").deleted) {
				player.get("message").delete()
			}
		})

		this.on("socketClosed", (player, payload) => {
			if (payload.byRemote) {
				return player.destroy()
			}
		})

		this.on("trackError", async (player, track, payload) => {
			const channel = client.channels.cache.get(player.textChannel)
			let lang = db.get(`${player.options.guild}_lang`) || "pt-BR"
			if (lang === "en-US") lang = client.lang.en
			if (lang === "pt-BR") lang = client.lang.pt

			return channel.send(lang.events.music.error.replace("{}", owner.tag) + "\n" + "`" + "**" + track.title + "**" + "\n" + payload.error + "`")
		})

		this.on("trackStuck", async (player, track, payload) => {
			const channel = client.channels.cache.get(player.textChannel)
			let lang = db.get(`${player.options.guild}_lang`) || "pt-BR"
			if (lang === "en-US") lang = client.lang.en
			if (lang === "pt-BR") lang = client.lang.pt

			return channel.send(lang.events.music.error.replace("{}", owner.tag) + "\n" + "`" + "**" + track.title + "**" + "\n" + payload.error + "`")
		})

		this.on("queueEnd", async (player) => {
			const channel = client.channels.cache.get(player.textChannel)
			let lang = db.get(`${player.options.guild}_lang`) || "pt-BR"
			if (lang === "en-US") lang = client.lang.en
			if (lang === "pt-BR") lang = client.lang.pt

			if (player.radio) return

			player.destroy()
			return channel.send({
				embeds: [{
					color: client.guilds.cache.get(player.options.guild).me.roles.highest.color || client.settings.color,
					description: lang.events.music.finish,
				}],
			})
		})
	}
}