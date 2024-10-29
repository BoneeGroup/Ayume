import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { GeniusToken } from "../../others/Config.js"
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js"
import { Client } from "genius-lyrics"

export default class LyricsCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "lyrics",
            category: "Música",
            description: "「Música」- Mostra o lyrics de uma música.",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "query",
                description: "Ver letra de alguma música",
                required: false
            }]
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const client = new Client(GeniusToken)

        const player = this.client.lava.players.get(interaction.guild!.id)

        if (!player && !interaction.options.getString("query", false)) {
            interaction.followUp("<:error:1065688085188325466> | Não tem nada tocando no servidor.")

            return;
        }

        const song = interaction.options.getString("query", false) ?? player!.queue.current!.title

        try {
            await client.songs.search(song)
        } catch (e) {
            interaction.followUp({
                content: `<:error:1065688085188325466> | Não foi localizado nenhuma músicas.`
            })

            return;
        }

        const searches = await client.songs.search(song)
        try {
            await searches[0].lyrics()
        } catch (e) {
            interaction.followUp({
                content: `<:error:1065688085188325466> | Não foi possível encontrar letras para a música \`${song}\`!`
            })

            return;
        }

        const lyrics = await searches[0].lyrics()

        const embed = new EmbedBuilder()
        embed.setColor(this.client.data.defaultColor)
        embed.setDescription(lyrics.slice(0, 2044) + "...")

        interaction.followUp({
            content: `<:yes:1065688082961158265> | Letra de **${searches[0].fullTitle}**:`,
            embeds: [embed]
        })
    }
}