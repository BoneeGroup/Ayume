const Command = require('../../Structures/Command')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'play',
			aliases: ['tocar', 'p'],
			usage: {
				pt: '<NOME DA MÚSICA | LINK DA MÚSICA | LINK DA PLAYLIST>',
				en: '<MUSIC NAME | MUSIC LINK | PLAYLIST LINK>',
			},
			description: {
				pt: 'Coloca uma música para tocar',
				en: 'Put a song to play',
			},
			category: 'Música',
			enabled: true,
			args: true,
		})
	}

	async run({ message, args }, lang) {

		const play = this.client.music.players.get(message.guild.id)

		const { channel } = message.member.voice

		if (!channel) return message.reply(lang.play.NoChannel)

		if (!play) {
			const player = this.client.music.create({
				guild: message.guild.id,
				voiceChannel: channel.id,
				textChannel: message.channel.id,
				selfDeafen: true,
			})

			if (!channel.joinable) {
				return message.reply(lang.play.permError)
			}

			await player.connect()

		}

		const player = this.client.music.players.get(message.guild.id)

		if (player.voiceChannel !== channel.id) {
			return message.reply(lang.play.mes)
		}

		const search = args.join(' ')
		let res;

		try {
			res = await player.search(search, message.author)
			if (res.loadType == 'LOAD_FAILED') {
				if (!player.queue.current) player.destroy()
				throw new Error(res.exception.message)
			}
		} catch (err) {
			if (!player.queue.current) player.destroy()
			return message.reply(lang.play.error + err.message)
		}

		const embed2 = new MessageEmbed()
		const embed3 = new MessageEmbed()

		switch (res.loadType) {
			case 'NO_MATCHES':
				if (!player.queue.current) player.destroy()
				await message.reply(lang.play.noResults)
			break;

			case 'TRACK_LOADED':
				if (message.slash) player.set('interaction', message)
				else player.set('interaction', undefined)
				player.queue.add(res.tracks[0])
				if (!player.playing && !player.paused && !player.queue.size) player.play()
				if (player.queue.size >= 1) {
					await message.reply({
						embeds: [{
							description: lang.play.trackLoad.replace('{}', `**${res.tracks[0].title}**`),
							color: message.guild.me.roles.highest.color || this.client.settings.color,
						}]
					})
				}
			break;

			case 'PLAYLIST_LOADED':

				if (message.slash) player.set('interaction', message)
				else player.set('interaction', undefined)

				if (player.queue.size >= 1) {
					embed2.setDescription(lang.play.playlistLoad2.replace('{}', `**${res.playlist.name}**`))
				} else {
					embed2.setDescription(lang.play.playlistLoad.replace('{}', `**${res.playlist.name}**`))
				}

				player.queue.add(res.tracks)

				if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play()
				embed2.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
				await message.reply({ embeds: [embed2] })
			break;

			case 'SEARCH_RESULT':

				if (message.slash) player.set('interaction', message)
				else player.set('interaction', undefined)

				await player.queue.add(res.tracks[0])

				if (!player.playing && !player.paused && !player.queue.length) player.play()
				embed3.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
				if (player.queue.size >= 1) {
					embed3.setDescription(lang.play.searchResults.replace('{}', `**${res.tracks[0].title}**`))
					return message.reply({ embeds: [embed3] })
				}
			break;
		}
	}
}