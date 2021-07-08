const Command = require("../../Structures/Command")
const { MessageEmbed } = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "nowplaying",
            aliases: ['np'],
            description: {
                pt: "Mostra a música que esta tocando no momento",
                en: "Shows the song currently playing"
            },
            category: "Música",
            enabled: true,
        })
    }

    async run({ message }, lang) {

        const player = this.client.music.players.get(message.guild.id);

        if (!player) return message.reply(lang.resume.nothing)

        const { title, duration, requester, uri } = player.queue.current
        let parsedCurrentDuration = this.client.utils.formatDuration(player.position)
        let parsedDuration = this.client.utils.formatDuration(duration)
        let part = Math.floor((player.position / duration) * 11)
        let uni = player.playing ? '▶' : '⏸️'
        let user = await this.client.users.fetch(requester.id)

        let sound;

        if (player.volume > 50) {
            sound = "🔊"
        } else if(player.volume < 50 && player.volume !== 0) {
            sound = "🔉"
        } else {
            sound = "🔈"
        }

        let embed = new MessageEmbed()
        embed.setAuthor(user.tag, user.displayAvatarURL({ size: 4096, dynamic: true }))
        embed.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
        embed.setDescription(`**[${title}](${uri})**\n${uni} ${'▬'.repeat(part) + '⚪' + '▬'.repeat(11 - part)} \`${parsedCurrentDuration}/${parsedDuration}\` ${sound}`)
        return message.reply({ embeds: [embed] })
    }
}
