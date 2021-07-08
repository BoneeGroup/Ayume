const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "vaporwave",
            aliases: ['vapor'],
            category: "Filtros",
            description: {
                pt: "Ativa o filtro vaporwave na música",
                en: "Active the vaporwave filter in the music"
            },
            enabled: true
        })
    }

    async run({ message }, lang) {

        const player = this.client.music.players.get(message.guild.id)

        if (!player) return await message.reply(lang.filters.nothing)

        if (!player.vaporwave) {
            player.setVaporwave(true)
            return await message.reply(lang.filters.enabled.replace("{}", this.name))
        }
    
        if (player.vaporwave) {
            player.setVaporwave(false)
            return await message.reply(lang.filters.disabled.replace("{}", this.name))
        }
    }
}