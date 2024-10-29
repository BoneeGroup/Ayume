import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { Command, RunCommand } from "../../structures/Command.js"

export default class MostPlayedCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "most",
            category: "Música",
            description: "「Música」- Mostra as músicas mais tocadas este mês",
            options: [{
                type: ApplicationCommandOptionType.Subcommand,
                name: "played",
                description: "「Música」- Mostra as músicas mais tocadas este mês."
            }],
            subCommands: ["played"],
        })
    }

    async run({ interaction }: RunCommand) {

        const data = await this.client.db.mostPlayed.findMany()
        
        const embed = new EmbedBuilder()
        embed.setColor(this.client.data.defaultColor)
        embed.setTitle("Músicas mais tocadas")

        const sort = data.sort((a, b) => a.count - b.count)
        const allPlayed = data.map(x => x.count).reduce((a, b) => a + b, 0)
        const songsArray = []
        
        for (const data of sort) {
            songsArray.push(`**${data.count}º** [\`${data.title}\`](${data.url})`)
        }

        if (songsArray.length == 0) {

            await interaction.deferReply({ ephemeral: true, fetchReply: true })

            interaction.followUp({
                content: "<:error:1065688085188325466> | Nenhuma música foi tocada nesse mês ainda.",
            })

            return;
        }

        await interaction.deferReply({ fetchReply: true })


        embed.setDescription(songsArray.slice(0, 10).join("\n"))
        embed.setFooter({ text: `Nesse mês eu reproduzi ${allPlayed.toLocaleString()} músicas` })

        interaction.followUp({
            embeds: [embed]
        })
    }
}