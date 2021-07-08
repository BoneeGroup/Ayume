const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'skip',
            aliases: ['pular'],
            category: "Música",
            description: {
                pt: "Pula uma música",
                en: "Skip the song"
            },
            enabled: true
        })
    }

    async run({ message, args }, lang) {

        const player = this.client.music.players.get(message.guild.id)

        const { channel } = message.member.voice

        if (!player) return await message.reply(lang.skip.nothing)

        if (!channel) return await message.reply(lang.skip.channelError)

        if (channel.id !== player.voiceChannel) return await message.reply(lang.skip.channelError2)


        player.stop(args.length === 0 ? 1 : Number(args[0]))
        if (message.slash) {
            return await message.reply(lang.skip.slash)
        } else {
            return await message.react("👍").catch(() => { })
        }
    }
}