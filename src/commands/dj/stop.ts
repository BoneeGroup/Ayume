import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"

export default class StopCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "stop",
            description: "「DJ」- Para de tocar as músicas no servidor.",
            category: "DJ",
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        const player = this.client.lava.players.get(interaction.guild!.id)

        if (!player) {
            await interaction.deferReply({ ephemeral: true })

            interaction.followUp("<:error:1065688085188325466> | Não há nada tocando nada no momento.")

            return;
        }

        player.destroy()

        await interaction.deferReply({ ephemeral: false })
        interaction.followUp({
            content: "<:yes:1065688082961158265> | Parei de tocar e a fila de música foi limpa."
        })
    }
}