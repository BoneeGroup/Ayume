import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { ApplicationCommandOptionType } from "discord.js"

export default class LoopCommands extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "loop",
            description: "「DJ」- Readiciona músicas a fila depois de tocadas.",
            category: "DJ",
            options: [
                {
                    name: "queue",
                    description: "「DJ」- Readiciona as músicas a fila depois de tocadas.",
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    name: "track",
                    description: "「DJ」- Toca a música que acabou de tocar novamente.",
                    type: ApplicationCommandOptionType.Subcommand
                }
            ],
            subCommands: ["queue", "track"],
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })
            
        if (interaction.options.getSubcommand(true) == "track") {
            this.client.commands.get("loop_track")!.run({ interaction } as RunCommand)

            return;
        }
    
        if (interaction.options.getSubcommand(true) == "queue") {
            this.client.commands.get("loop_queue")!.run({ interaction } as RunCommand)

            return;
        }
    }
}
