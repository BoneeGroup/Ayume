import { Command, RunCommand } from "../../../structures/Command.js"
import AyumeClient from "../../../structures/AyumeClient.js"

export default class LoopTrackSubCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "loop_track",
            description: ".",
            category: "DJ",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

        const player = this.client.lava.players.get(interaction.guild!.id)

        if (!player) { 
            interaction.followUp({
                content: "<:error:1065688085188325466> | Não tem nenhuma música tocando no momento."
            })
            return;
        }

        player.setLoop(player.loop == "none" ? "track" : "none")

        await interaction.followUp({
            content: `<:yes:1065688082961158265> | Loop de música ${player.loop == "track" ? "**ATIVADO**" : "**DESATIVADO**"}.`
        })

    }
}
