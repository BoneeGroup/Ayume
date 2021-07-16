const Event = require('../../Structures/Event')

module.exports = class extends Event {

	async run(message) {

		const mentionRegex = new RegExp(`^<@!?${this.client.user.id}>$`)

		if (message.author.bot) return;

		let lang = db.get(`${message.guild.id}_lang`) || "pt-BR"

		let check = db.get(`${message.guild.id}_lang`) || "pt-BR"

		let ptBR = JSON.parse(JSON.stringify(this.client.lang.pt))
        let enUS = JSON.parse(JSON.stringify(this.client.lang.en))


		switch (lang) {
			case "pt-BR":
				lang = ptBR
			break;
			case "en-US":
				lang = enUS
			break;
		}

		const prefix = db.get(`${message.guild.id}_prefix`) || this.client.prefix

		if (message.content.match(mentionRegex)) return await message.reply({
			embeds: [{
				description: lang.events.message.prefix.replace("**${message.author.tag}**", `**${message.author.tag}**`).replace("`${prefix}`", `\`${prefix}\``),
				color: message.guild.me.roles.highest.color || this.client.settings.color,
				timestamp: Date.now(),
				footer: {
					icon_url: this.client.user.displayAvatarURL(),
					text: `${this.client.user.username} ${lang.events.message.footer} ${this.client.settings.version}`
				}
			}]
		})


		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);


		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

		if (command) {


			if (command.guildOnly && !message.channel.guild) {
				return await message.reply(lang.events.message.dmError)
			}

			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
				return await message.reply(lang.events.message.ownerError);
			}

			if (!command.enabled) {
				return await message.reply(lang.events.message.enabledError)
			}

			if (command.args && !args.length) {
				return await message.reply(lang.events.message.argsError.start  + `\`${prefix}${command.name} ${db.get(`${message.guild.id}_lang`) == 'en-US' ? command.usage.en : command.usage.pt}\``)
			}

			if (message.guild) {

				const userPermCheck = command.userPerms || this.client.defaultPerms.add(command.userPerms)
				if (userPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
					if (missing.length) {
						let langSelector = check == "en-US" ? this.client.lang.permissions.en[this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))] : this.client.lang.permissions.pt[this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))]
						return await message.reply(lang.events.message.permissions.missingUser + "`" + langSelector + "`" + lang.events.message.permissions.endUser)
					}
				}

				const botPermCheck = command.botPerms || this.client.defaultPerms.add(command.botPerms)
				if (botPermCheck) {
					const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);
					if (missing.length) {
						let langSelector = check == "en-US" ? this.client.lang.permissions.en[this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))] : this.client.lang.permissions.pt[this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))]
						return await message.reply(lang.events.message.permissions.missingBot + "`" + langSelector + "`" + lang.events.message.permissions.endBot);
					}
				}
			}

			try {
				await command.run({ message, args, prefix }, lang)
			} catch(e) {
				console.log(e)
				return await message.reply(lang.events.message.error.replace("{}", owner.tag) + "\n" + "`" + e + "`")
			}
		}
	}
}