const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "pause",
            aliases: ['pausar'],
            description: {
                pt: "Pausa a música",
                en: "Pause the music"
            },
            category: "Música",
            enabled: true
        })
    }

    async run({ message }, lang) {

        const player = this.client.music.players.get(message.guild.id)

        const { channel } = message.member.voice

        if (!player) return await message.reply(lang.pause.nothing)

        if (!channel) return await message.reply(lang.pause.channelError)

        if (channel.id !== player.voiceChannel) return await message.reply(lang.pause.channelError2)

        if (player.paused) {
            return await message.reply(lang.pause.noPaused)
        } else {
            player.pause(true)
            return await message.reply(lang.pause.successfully)
        }
    }
}