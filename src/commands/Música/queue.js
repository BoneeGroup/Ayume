const Command = require('../../Structures/Command');
const { MessageEmbed } = require("discord.js")
module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "queue",
            category: "Música",
            description: {
                pt: "Mostra a fila de música",
                en: "Show the music queue"
            },
            aliases: ["fila", "q"],
            enabled: true,
            guildOnly: true,
        })
    }

    async run({ message }, lang) {

        const player = this.client.music.players.get(message.guild.id)

        if (!player) return await message.reply(lang.queue.nothing)

        const completeQueue = [this.client.music.players.get(message.guild.id).queue.current, ...this.client.music.players.get(message.guild.id).queue]

        let embed = new MessageEmbed()
        embed.setDescription(completeQueue.map(a => `**${completeQueue.indexOf(a) + 1}º** - ${a.title} - ${a.requester}`).slice(0, 10).join('\n'))
        embed.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
        embed.setFooter(lang.queue.footer + completeQueue.length)
        return await message.reply({ embeds: [embed] })
    }
}