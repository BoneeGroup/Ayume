const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "invite",
            aliases: ['convite'],
            description: {
                pt: "Mostra o convite do bot",
                en: "Show the bot invite"
            },
            category: "Utilidades",
            enabled: true,
            guildOnly: false
        })
    }

    async run({ message }) {

        return await message.reply({
            content: "<https://ayume.bonee.xyz/add>"
        })
    }
}