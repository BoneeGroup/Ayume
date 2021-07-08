const Command = require("../../Structures/Command")
module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "prefix",
            category: "Utilidades",
            usage: {
                pt: "<NOVO PREFIX | RESET>",
                en: "<NEW PREFIX | RESET",
            },
            description: {
                pt: "Muda o prefixo do bot no servidor",
                en: "Change the bot prefix in server"
            },
            args: true,
            enabled: true,
            userPerms: ["MANAGE_GUILD"]
        })
    }

    async run({ message, args }, lang) {

        let p = ["reset".toLowerCase(), "resetar".toLowerCase()]

        if (p.includes(args[0])) {
            if (!db.get(`${message.guild.id}_prefix`)) {
                return await message.reply(lang.prefix.standard)
            }
            db.delete(`${message.guild.id}_prefix`)
            return await message.reply(lang.prefix.successfully)
        }

        if (args[0].length >= 4) {
            return message.reply(lang.prefix.error)
        }

        db.set(`${message.guild.id}_prefix`, args[0])
        return await message.reply(lang.prefix.newPrefix + ` \`${args[0]}\``)
        
    } 
}