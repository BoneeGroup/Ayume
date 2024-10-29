import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { ApplicationCommandOptionType } from "discord.js"

export default class ConfigCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "config",
            description: "「Administrador」- Configura algumas coisas do bot",
            category: "Administrador",
            options: [
                {
                    name: "dj",
                    description: "「Administrador」- Define o cargo de DJ no servidor",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [{
                        name: "cargo",
                        description: "Cargo para definir como DJ",
                        required: false,
                        type: ApplicationCommandOptionType.Role
                    }]
                },
                {
                    name: "modlogs",
                    description: "「Administrador」- Define o canal onde irei enviar as logs",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [{
                        name: "canal",
                        description: "Canal onde irei enviar as logs do servidor",
                        required: false,
                        type: ApplicationCommandOptionType.Channel
                    }]
                },
                {
                    name: "view",
                    description: "「Administrador」- Veja as configuraçoes do servidor",
                    type: ApplicationCommandOptionType.Subcommand
                }
            ],
            subCommands: ["dj", "modlogs", "view"]
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        if (interaction.options.getSubcommand(true) == "dj") {
            this.client.commands.get("config_dj")!.run({ interaction } as RunCommand)

            return;
        }

        if (interaction.options.getSubcommand(true) == "modlogs") {
            this.client.commands.get("config_modlogs")!.run({ interaction } as RunCommand)

            return;
        }

        if (interaction.options.getSubcommand(true) == "view") {
            this.client.commands.get("config_view")!.run({ interaction } as RunCommand)

            return;
        }
    }
}