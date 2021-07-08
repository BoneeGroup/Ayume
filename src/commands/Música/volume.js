const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "volume",
            description: {
                pt: "Aumenta ou diminiu o volume",
                en: "Increases or decreases the volume"
            },
            category: "Música",
            aliases: ['vol']
        })
    }

    async run({ message, args }, lang) {

        const player = this.client.music.players.get(message.guild.id)

        if (!player) return await message.reply(lang.volume.nothing)

        const { channel } = message.member.voice

        if (!channel) return await message.reply(lang.volume.channelError)

        if (channel.id !== player.voiceChannel) return await message.reply(lang.volume.channelError)

        if (!args.length) return await message.reply(lang.volume.volume.replace("{}", "`" + player.volume + "`"))

        const volume = Number(args[0])

        if (!volume || volume < 1 || volume > 100) return message.reply(lang.volume.invalid)

        player.setVolume(volume)
        return await message.reply(lang.volume.successfully.replace("{}", "`" + player.volume + "`"))
    }
}