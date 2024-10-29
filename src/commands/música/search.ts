import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType, StringSelectMenuBuilder, Message } from "discord.js"
import { KazagumoPlayer, KazagumoSearchResult, KazagumoTrack } from "kazagumo"

export default class SearchCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "search",
            category: "Música",
            description: "「Música」- Pesquisa uma música e a coloca para tocar.",
            options: [{
                name: "query",
                description: "Música para ser pesquisada.",
                type: ApplicationCommandOptionType.String,
                required: true
            }]
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const member = await interaction.guild!.members.fetch(interaction.user.id)
        const { channel } = member!.voice

        if (!channel) {
            interaction.followUp({ content: "<:error:1065688085188325466> | Você não está em nenhum canal de voz." })

            return;
        }

        if (!this.client.lava.players.get(interaction.guild!.id)) {

            if (!channel.joinable) {
                interaction.followUp({ content: "<:error:1065688085188325466> | Não consigo entrar no canal de voz solicitado." })

                return;
            }

            await this.client.lava.createPlayer({
                guildId: interaction.guild!.id,
                textId: interaction.channel!.id,
                voiceId: channel.id,
                deaf: true
            })
        }

        const player = this.client.lava.players.get(interaction.guild!.id) as KazagumoPlayer

        if (player.voiceId !== channel.id) {
            interaction.followUp(`<:error:1065688085188325466> | Estou tocando música em \`${interaction.guild!.channels.cache.get(player.voiceId ?? "Unknown")}\``)

            return;
        }

        const query = interaction.options.getString("query", true)

        const res = await player.search(query, {
            requester: interaction.user
        })

        if (!res.tracks.length) {
            interaction.followUp({ content: "<:error:1065688085188325466> | Não localizei nenhuma música." })

            player!.destroy()
            return;
        }

        if (res.type == "PLAYLIST") {
            if (!player.queue.current) player.destroy()
            interaction.followUp("<:error:1065688085188325466> | Por favor não envie links de playlist.")

            return;
        }

        if (res.type == "TRACK") {
            interaction.followUp("<:error:1065688085188325466> | Por favor não envie links de músicas.")
            player.destroy()

            return;
        }

        if (res.type == "SEARCH") {

            var max = 15

            if (res.tracks.length < max) max = res.tracks.length

            const options = res.tracks.slice(0, max).map(({ title, identifier }) => {
                return { title, identifier }
            })


            const buttonQueue = new ButtonBuilder({
                label: "Clique para ver a lista de músicas",
                customId: "queue",
                emoji: "🎵",
                style: ButtonStyle.Success
            })

            const buttonRow = new ActionRowBuilder<ButtonBuilder>()
            buttonRow.addComponents([buttonQueue])

            const menuOptions = []
            for (const a of options) {
                menuOptions.push({
                    label: a.title.slice(0, 100),
                    value: a.identifier
                })
            }

            const menu = new StringSelectMenuBuilder({
                placeholder: `${max} músicas encontradas`,
                customId: "musicSelector",
                minValues: 1,
                maxValues: max,
                options: menuOptions,
            })

            const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            row.addComponents([menu])

            const results = res.tracks
                .slice(0, max)
                .map((track, index) => `**${++index}º** \`[${this.client.utils.formatDuration(track.length ?? 0)}]\` **[${track.title}](${track.uri})**`)
                .join("\n")

            const embed = new EmbedBuilder()
            embed.setColor(this.client.data.defaultColor)
            embed.setTimestamp()
            embed.setDescription(results)

            const response = await interaction.followUp({
                embeds: [embed],
                components: [row]
            })

            const collector = response.createMessageComponentCollector({
                filter: (i) => {
                    if (["musicSelector", "queue"].includes(i.customId)) {
                        if (i.user.id !== interaction.user.id) {
                            i.reply({
                                content: "<:error:1065688085188325466> | Apenas o autor pode usar essas interaçoes.",
                                ephemeral: true
                            })
                            return false
                        }
                        return true
                    }
                    return false
                },
                time: 60000
            })

            const tracks: KazagumoTrack[] = []

            collector.on("collect", async (i) => {

                if (i.isStringSelectMenu() && i.customId == "musicSelector") {

                    await i.deferUpdate()

                    for (const id of i.values) {
                        tracks.push(res.tracks.find(t => t.identifier == id) as KazagumoTrack)
                    }

                    player.queue.add(tracks)
                    if (!player.playing && !player.paused) player.play()

                    const embed = new EmbedBuilder()
                    embed.setColor(this.client.data.defaultColor)
                    embed.setDescription(`<:yes:1065688082961158265> | Adicionado \`${tracks.length}\` músicas à fila.`)

                    await i.message.edit({ embeds: [embed], components: [buttonRow] })
                    // @ts-ignore
                    this.client.lava.emit("playingNow", player, player.queue.current, interaction)

                    return;
                }

                if (i.isButton() && i.customId == "queue") {

                    const embed = new EmbedBuilder()
                    embed.setColor(this.client.data.defaultColor)
                    embed.setTimestamp()
                    embed.setDescription(`<:yes:1065688082961158265> | As seguintes músicas foram adicionadas à fila:\n${tracks.map((track, index) => `**${++index}º** \`[${this.client.utils.formatDuration(track.length ?? 0)}]\` **[${track.title}](${track.uri})**`).join("\n")}`)

                    i.reply({
                        embeds: [embed]
                    })

                    await i.message.edit({
                        components: []
                    }).catch(() => { })


                    collector.stop()
                    return;
                }
            })
        }
    }
}