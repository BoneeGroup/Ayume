import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { ApplicationCommandOptionType } from "discord.js"

export default class ForceSkipCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "force",
            description: "「DJ」- Skipa a música tocando no momento.",
            options: [{
                name: "skip",
                description: "「DJ」- Skipa a música tocando no momento.",
                type: ApplicationCommandOptionType.Subcommand
            }],
            subCommands: ["skip"],
            category: "DJ",
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const player = this.client.lava.players.get(interaction.guild!.id)

        if (player!.loop == "queue" ?? player!.loop == "track") player!.setLoop("none")
        
        player?.skip()
        interaction.followUp({
            content: `<:yes:1065688082961158265> | **${player?.queue.current?.title}** Pulada ( Por **${interaction.user.username}** )`
        })
    }
}