import { Command, RunCommand } from "../../structures/Command.js"
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js"
import AyumeClient from "../../structures/AyumeClient.js"

export default class QueueCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "queue",
            category: "Música",
            description: "「Música」- Mostra a fila de música.",
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })
        
        const player = this.client.lava.players.get(interaction.guild!.id)

        if (!player) return interaction.followUp("<:error:1065688085188325466> | Não tem nada tocando no servidor.")

        const parsedQueueDuration = this.client.utils.time(this.client.utils.getQueueDuration(player))
        var pagesNum = Math.ceil(player.queue.length / 10)

        const songStrings = []
        for (var i = 0; i < player.queue.length; i++) {
            const song = player.queue[i]
            // @ts-ignore
            songStrings.push(`**${i + 1}º** \`[${this.client.utils.formatDuration(song?.length)}]\` **${song?.title}** - <@${song.requester ? song.requester!.id : null}>`)
        }

        const pages: EmbedBuilder[] = []
        for (var i = 0; i < pagesNum; i++) {

            const str = songStrings.slice(i * 10, i * 10 + 10).join("\n")
            const embed = new EmbedBuilder()
            embed.setColor(this.client.data.defaultColor)
            embed.setDescription(str)
            embed.setFooter({
                text: `Página ${i + 1}/${pagesNum}`,
            })

            pages.push(embed)
        }

        const forwardButton = new ButtonBuilder({
            emoji: "➡️",
            customId: `forward_${interaction.user.id}`,
            style: ButtonStyle.Secondary,
            disabled: pagesNum == 1 ? true : false
        })

        const backwardButton = new ButtonBuilder({
            emoji: "⬅️",
            customId: `backward_${interaction.user.id}`,
            style: ButtonStyle.Secondary,
            disabled: pagesNum == 1 ? true : false
        })

        const row = new ActionRowBuilder<ButtonBuilder>()
        row.addComponents([backwardButton, forwardButton])

        const msg = await interaction.followUp({
            content: `**[${player.queue.current!.title}](<${player.queue.current!.realUri}>)** | ${player.queue.length} músicas ${parsedQueueDuration}`,
            embeds: [pagesNum == 0 ? new EmbedBuilder().setDescription("Não há músicas na fila.").setColor(this.client.data.defaultColor) : pages[0]],
            components: [row]
        })

        const collector = msg.createMessageComponentCollector({
            filter: (i) => {
                if ([`forward_${interaction.user.id}`, `backward_${interaction.user.id}`].includes(i.customId)) {
                    if (i.user.id !== interaction.user.id) {
                        i.reply({ 
                            content: "<:error:1065688085188325466> | Apenas o autor pode usar os botões!",
                            ephemeral: true
                        })
                        return false
                    }
                    return true
                }
                return false
            },
            componentType: ComponentType.Button,
            time: 60000
        })

        var page = 0
        collector.on("collect", async (i) => {

            if (i.customId == `forward_${interaction.user.id}`) {
                page = page + 1 < pages.length ? ++page : 0

                await i.deferUpdate().catch(() => { })

                i.editReply({
                    embeds: [
                        pagesNum == 0 ? new EmbedBuilder().setDescription("Não há músicas na fila.").setColor(this.client.data.defaultColor) : pages[page]
                    ],
                    components: [row]
                })

                collector.resetTimer()
                return;
            }

            if (i.customId == `backward_${interaction.user.id}`) {
                page = page > 0 ? --page : pages.length - 1

                await i.deferUpdate().catch(() => { })
                
                i.editReply({
                    embeds: [
                        pagesNum == 0 ? new EmbedBuilder().setDescription("Não há músicas na fila.").setColor(this.client.data.defaultColor) : pages[page]
                    ],
                    components: [row]
                })

                collector.resetTimer()
                return;
            }
        })

        collector.on("end", () => {
            msg.edit({
                components: []
            }).catch(() => { })

            return;
        })
    }
}