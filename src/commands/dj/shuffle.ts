import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"

export default class ShuffleCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "shuffle",
            description: "「DJ」- Embaralha a fila de música.",
            category: "DJ",
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const player = this.client.lava.players.get(interaction.guild!.id)
        
        if (player?.queue.length == 0) {
            interaction.followUp({
                content: `<:error:1065688085188325466> | Não tem nenhuma música na fila para embaralhar!`
            })

            return;
        }

        player?.queue.shuffle()

        interaction.followUp({
            content: `<:yes:1065688082961158265> | Embaralhado com sucesso ${player?.queue.length} músicas.`
        })
    }
}