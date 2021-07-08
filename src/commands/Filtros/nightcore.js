const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "nightcore",
            aliases: ['night'],
            category: "Filtros",
            description: {
                pt: "Ativa o filtro nightcore na música",
                en: "Active the nightcore filter in the music"
            },
            enabled: true
        })
    }

    async run({ message }, lang) {

        const player = this.client.music.players.get(message.guild.id)

        if (!player) return await message.reply(lang.filters.nothing)

        if (!player.nightcore) {
            player.setNightcore(true)
            return await message.reply(lang.filters.enabled.replace("{}", this.name))
        }
    
        if (player.nightcore) {
            player.setNightcore(false)
            return await message.reply(lang.filters.disabled.replace("{}", this.name))
        }
    }
}