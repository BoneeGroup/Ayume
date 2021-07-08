const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "animu",
            category: "Música",
            description: {
                pt: "Faça o bot entrar em um canal de voz, e começar a tocar a radio Animu",
                en: "Make the bot join a voice channel, and start playing the Animu radio"
            },
            enabled: true,
            guildOnly: true
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
                volume: 40,
                selfDeafen: true,
            })
            if (!channel.joinable) {
                return message.reply(lang.play.permError)
            }
            await player.connect()
        }

        const player = this.client.music.players.get(message.guild.id)


        let res;

        if (player.voiceChannel !== channel.id) {
            return message.reply(lang.play.mes)
        }

        try {
            res = await player.search("https://cast.animu.com.br:9006/stream", message.author)
            if (res.loadType == "LOAD_FAILED") {
                if (!player.queue.current) player.destroy()
                throw new Error(res.exception.message)
            }
        } catch (err) {
            if (!player.queue.current) player.destroy()
            return message.reply(lang.play.error + err.message)
        }

        switch (res.loadType) {
            case "NO_MATCHES":
                if (!player.queue.current) player.destroy()
                await message.reply(lang.play.noResults)
            break;

            case "TRACK_LOADED":
                if (message.slash) player.set('interaction', message)
                else player.set('interaction', undefined)
                player.queue.add(res.tracks[0])
                if (!player.playing && !player.paused && !player.queue.size) player.play()
                if (player.queue.size >= 1) {
                    await message.reply({
                        embeds: [{
                            description: lang.radio.queueAdd,
                            color: message.guild.me.roles.highest.color || this.client.settings.color,
                        }]
                    })
                }
            break;
        }
    }
}