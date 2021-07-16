const Event = require("../../Structures/Event")

module.exports = class extends Event {

    async run(oldVoice, newVoice) {

        const player = this.client.music.players.get(oldVoice.guild.id)

        let lang = db.get(oldVoice.guild.id) || 'pt-BR'
		if (lang === 'en-US') lang = this.client.lang.en
        if (lang === 'pt-BR') lang = this.client.lang.pt

		if (!player) return

		if (!newVoice.guild.members.cache.get(this.client.user.id).voice.channelId) return player.destroy()

		if (oldVoice.id === this.client.user.id) return

		if (!oldVoice.guild.members.cache.get(this.client.user.id).voice.channelId) return

		if (oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.id === oldVoice.channelId) {

			if (oldVoice.guild.me.voice.channel && oldVoice.guild.me.voice.channel.members.size == 1) {

				const vcName = oldVoice.guild.me.voice.channel.name
				const msg = await this.client.channels.cache.get(player.textChannel).send({
                    embeds: [{
                        description: lang.events.music.leaving.replace("${vcName}", `${vcName}`).replace("${this.client.settings.voiceLeave}", `${this.client.utils.time(this.client.settings.voiceLeave)}`),
                        color: this.client.guilds.cache.get(player.options.guild).me.roles.highest.color || this.client.settings.color
                    }]
                })

				const delay = ms => new Promise(res => setTimeout(res, ms))

				await delay(this.client.settings.voiceLeave)

				const vcMembers = oldVoice.guild.me.voice.channel.members.size

				if (!vcMembers || vcMembers === 1) {
					const newPlayer = this.client.music.players.get(newVoice.guild.id)
					if (newPlayer) {
						player.destroy()
					} else { 
                        oldVoice.guild.me.voice.channel.leave()
                    }

					return await msg.edit({
                        embeds: [{
                            description: lang.events.music.alone.replace("${vcName}", `${vcName}`),
                            color: this.client.guilds.cache.get(player.options.guild).me.roles.highest.color || this.client.settings.color
                        }]
                    })
				} else { 
                    return await msg.delete()
                }
			}
        }
    }
}