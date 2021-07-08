const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "resume",
            aliases: ["despausar"],
            description: {
                pt: "Despausa a música",
                en: "Unpause the music"
            },
            category: "Música",
            enabled: true
        })
    }

    async run({ message }, lang) {
        const player = this.client.music.players.get(message.guild.id)

        const { channel } = message.member.voice

        if (!player) return await message.reply(lang.resume.nothing)
        

        if (!channel) return await message.reply(lang.resume.channelError)

        if (channel.id !== player.voiceChannel) return await message.reply(lang.resume.channelError2)

        if (!player.paused) {
            return await message.reply(lang.resume.noResumed)
        } else {
            player.pause(false)
            return await message.reply(lang.resume.successfully)
        }
    }
}