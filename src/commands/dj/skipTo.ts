import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { ApplicationCommandOptionType } from "discord.js"

export default class ForceSkipCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "skipto",
            description: "「DJ」- Pula para uma música especifica.",
            usage: "<posição>",
            category: "DJ",
            options: [{
                name: "posição",
                description: "Possição da música para tocar",
                type: ApplicationCommandOptionType.Number,
                required: true
            }],
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })
        
        const player = this.client.lava.players.get(interaction.guild!.id)

        const arg = interaction.options.getNumber("posição", true)

        // @ts-ignore
        if (arg > player?.queue.totalSize || (arg && !player?.queue[arg - 1])) {
            interaction.followUp({
                content: `<:error:1065688085188325466> | A posição deve ser um número entre 1 e ${player?.queue.totalSize}`
            })
            return;
        }

        const song = player?.queue[arg - 1].title

        if (arg == 1) player?.skip()
        player?.queue.splice(0, arg - 1)
        player?.skip()
        
        interaction.followUp({
            content: `<:yes:1065688082961158265> | Pulado para **${song}**`
        })
    }
}