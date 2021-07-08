const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js")

module.exports = async function MusicSelector(client, message) {

    let pauseButton = new MessageButton()
    pauseButton.setCustomID("pauseButton")
    pauseButton.setStyle("PRIMARY")
    pauseButton.setDisabled(false)
    pauseButton.setEmoji("⏸")
    pauseButton.setLabel("Pause.")

    let resumeButton = new MessageButton()
    resumeButton.setCustomID("resumeButton")
    resumeButton.setStyle("PRIMARY")
    resumeButton.setDisabled(false)
    resumeButton.setEmoji("▶")
    resumeButton.setLabel("Resume.")

    let volumeButton = new MessageButton()
    volumeButton.setCustomID("setCustomID")
    volumeButton.setStyle("PRIMARY")
    volumeButton.setDisabled(false)
    volumeButton.setEmoji("🔊")
    volumeButton.setLabel("Volume.")

    let loopButton = new MessageButton()
    loopButton.setCustomID("loopButton")
    loopButton.setStyle("PRIMARY")
    loopButton.setDisabled(false)
    loopButton.setEmoji("🔁")
    loopButton.setLabel("Loop.")

    let skipButton = new MessageButton()
    skipButton.setCustomID("skipButton")
    skipButton.setStyle("PRIMARY")
    skipButton.setDisabled(false)
    skipButton.setEmoji("⏭")
    skipButton.setLabel("Skip.")

    let row = new MessageActionRow()
    row.addComponents([pauseButton, resumeButton, volumeButton, loopButton, skipButton])

    const player = client.music.players.get(message.guild.id)

    let channel = db.get(`${message.guild.id}_painel`)
    let fetch = db.get(`${message.guild.id}_idMessage`)

    const filter = (m) => m.author.id === user.id && !m.author.bot

    let channelObj = client.channels.cache.get(channel)

    let msg = await client.channels.cache.get(channel).messages.fetch(fetch)

    if (message.channel.id !== channelObj.id) return;

    let collected;

    const collector = msg.channel.createMessageCollector(filter, { time: 60000, idle: 60000 })

    collector.on("collect", (collectd) => {
        collected = collector.collected.first().content
        collector.stop()
    })

    //if (!player.queue.current) player.destroy()

    const result = await client.music.search({ query: "vmz", source: "youtube" }, message.author)

    switch (result.loadType) {
        case "NO_MATCHES":
            await msg.edit({
                embeds: [{
                    description: "Não foi possivel achar nenhum resultado."
                }]
            })

            setTimeout(async () => {
                await msg.edit({
                    embeds: [{
                        description: "Para escolher uma música, basta enviar o nome da música, e selecionar a música desejada no menu abaixo. :)"
                    }]
                })
            }, 10e3)
            break;

        case "SEARCH_RESULT":
            let max = 15

            if (result.tracks.length < max) max = result.tracks.length

            let options = result.tracks.slice(0, max).map(({ title, identifier }) => {
                return { title, identifier }
            })

            let menu = new MessageSelectMenu()
            menu.setCustomID("musicSelector")
            menu.setDisabled(false)
            menu.setMinValues(1)
            menu.setMaxValues(max)
            menu.setPlaceholder(max + " Músicas")

            let i = 0

            for (const a of result.tracks) {
                i++
                menu.addOptions([
                    {
                        label: `${i} | ${a.title.slice(0, 20)}`,
                        description: a.title.slice(0, 50),
                        value: a.identifier
                    }
                ])
            }

            const results = result.tracks
                .slice(0, max)
                .map((track, index) => `\`${++index}.\` **[${track.title}](${track.uri})**`)
                .join('\n')

            await msg.edit({
                embeds: [{
                    description: results,
                }],
                components: [row, [menu]]
            })
        break;
    }
}