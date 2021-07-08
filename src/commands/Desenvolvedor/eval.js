const Command = require('../../Structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["ev", "e"],
            description: {
                pt: "Roda codigos",
                en: "Run codes"
            },
            category: 'Desenvolvedor',
            ownerOnly: true,
            args: true,
            name: "eval",
            usage: {
                pt: "<Codigo>",
                en: "<CODE>"
            },
            guildOnly: false,
            enabled: true
        })
    }

    async run({ message, args, prefix }, lang) {

        try {
            let code = await eval(args.join(" "))
            if (typeof code !== 'string') code = await require('util').inspect(code, { depth: 0 })
            message.reply(`📩 Entrada \`\`\`js\n${args.join(" ")}\`\`\`\n🚩 Saída \`\`\`js\n${code.slice(0, 1010)}\n\`\`\``, { ephemeral: true })
        } catch (err) {
            message.reply(`\`\`\`js\n${err}\n\`\`\``, { ephemeral: true })
        }
    }
}
