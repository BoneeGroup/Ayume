const Command = require('../../Structures/Command')
const { MessageEmbed, MessageSelectMenu } = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "search",
            aliases: ["pesquisar"],
            usage: {
                pt: "<NOME DA MÚSICA>",
                en: "<MUSIC NAME>"
            },
            description: {
                pt: "Pesquisa uma música e a coloca para tocar",
                en: "Search for a song and put it to play"
            },
            category: "Música",
            enabled: true,
            args: true
        })
    }

    async run({ message, args }, lang) {

        let play = this.client.music.players.get(message.guild.id)

        const { channel } = message.member.voice

        if (!channel) return await message.reply(lang.play.NoChannel)

        if (!play) {

            const player = message.client.music.create({
                guild: message.guild.id,
                voiceChannel: channel.id,
                textChannel: message.channel.id,
                selfDeafen: true
            })

            if (!channel.joinable) {
                return await message.reply(lang.play.permError)
            }

            await player.connect()

        }

        const player = this.client.music.players.get(message.guild.id)

        if (player.voiceChannel !== channel.id) {
            return await message.reply(lang.play.mes)
        }

        const search = args.join(' ')
        let res;

        try {
            res = await player.search(search, message.author)
            if (res.loadType === 'LOAD_FAILED') {
                if (!player.queue.current) player.destroy();
                throw new Error(res.exception.message);
            }
        } catch (err) {
            return await message.reply(lang.play.error + err.message);
        }

        switch (res.loadType) {
            case 'NO_MATCHES':
                if (!player.queue.current) player.destroy();
                await message.reply(lang.play.noResults);
            break;

            case 'PLAYLIST_LOADED':
                await await message.reply(lang.play.noLinks)
                player.destroy()
            break;

            case 'TRACK_LOADED':
                await message.reply(lang.play.noLinks)
                player.destroy()
            break;

            case 'SEARCH_RESULT':
                let max = 15, collected, filter = (interaction) => ["musicSelector"].includes(interaction.customID)
                if (res.tracks.length < max) max = res.tracks.length;

                let options = res.tracks.slice(0, max).map(({ title, identifier }) => {
                    return { title, identifier }
                })


                const menu = new MessageSelectMenu()
                menu.setCustomID("musicSelector")
                menu.setPlaceholder(max + lang.play.musics)
                menu.setMinValues(1)
                menu.setMaxValues(max)


                let i = 0

                for (const a of options) {
                    i++
                    menu.addOptions([
                        {
                            label: `${i} | ${a.title.slice(0, 20)}`,
                            description: a.title.slice(0, 50),
                            value: a.identifier
                        }
                    ])
                }

                const results = res.tracks
                    .slice(0, max)
                    .map((track, index) => `\`${++index}.\` **[${track.title}](${track.uri})**`)
                    .join('\n')

                let embed3 = new MessageEmbed()
                embed3.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
                embed3.setTimestamp()
                embed3.setDescription(results)
                let msg = await message.reply({ embeds: [embed3], components: [[menu]] })

                const collector = message.channel.createMessageComponentInteractionCollector({ time: 60000, idle: 60000 })

                collector.on("end", async (interaction) => {
                    menu.setDisabled(true)
                    return await msg.edit({
                        components: [[menu]]
                    })
                })

                collector.on("collect", async (interaction) => {

                    if (collector.users.first().id !== message.author.id) {
                        return interaction.reply({ content: lang.play.onlyAuthor, ephemeral: true })
                    }

                    switch(interaction.customID) {
                        case "musicSelector":

                            let track = []

                            for (const id of interaction.values) {
                                track.push(res.tracks.find(a => a.identifier === id))
                            }


                            player.queue.add(track)
                            if (!player.playing && !player.paused && player.queue.totalSize === track.length) player.play()

                            if (message.slash) player.set('interaction', message)


                            let embed = new MessageEmbed()
                            embed.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
                            embed.setDescription(lang.play.searchResults.replace("{}", track.map((a, index) => `${index + 1}º **${a.title}**`).join("\n")))
                            await interaction.reply({ embeds: [embed], ephemeral: false })
                            menu.setDisabled(true)
                            await msg.edit({ components: [[menu]] })
                            collector.stop()
                        break;
                    }
                })
            break;
        }
    }
}