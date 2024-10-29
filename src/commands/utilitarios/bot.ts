import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { ApplicationCommandOptionType } from "discord.js"

export default class BotCommands extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "bot",
            subCommands: ["convite", "info"],
            description: "「Utilitários」- Veja algumas informações sobre mim.",
            category: "Utilitários",
            options: [
                {
                    name: "info",
                    description: "「Utilitários」- Mostra algumas informaçoes extras sobre mim.",
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    name: "invite",
                    description: "「Utilitários」- Link para me adicionar hihi.",
                    type: ApplicationCommandOptionType.Subcommand
                }
            ]
        })
    }

    async run({ interaction }: RunCommand) {

        if (interaction.options.getSubcommand(true) == "invite") {
            await interaction.deferReply({ fetchReply: false, ephemeral: true })

            this.client.commands.get("bot_invite")!.run({ interaction } as RunCommand)

            return;
        }

        if (interaction.options.getSubcommand(true) == "info") {
            await interaction.deferReply({ fetchReply: true })

            this.client.commands.get("bot_info")!.run({ interaction } as RunCommand)

            return;
        }
    }
}
