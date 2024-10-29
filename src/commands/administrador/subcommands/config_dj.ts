import { Command, RunCommand } from "../../../structures/Command.js"
import AyumeClient from "../../../structures/AyumeClient.js"
import { Role } from "discord.js"

export default class ConfigDjSubCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "config_dj",
            description: ".",
            category: "Admin",
            showInHelp: false,
            isSubCommand: true
        })
    }

    async run({ interaction }: RunCommand) {

        const role = interaction.options.getRole("cargo", false) as Role

        const data = await this.client.db.baseGuildData.findFirst({ where: { guildId: interaction.guild!.id } })

        if (!role && !data?.djRole) {
            interaction.followUp({
                content: "<:error:1065688085188325466> | O servidor não tem nenhum cargo de DJ definido.",
            })
            return;
        }

        if (!role && data!.djRole) {
            await this.client.db.baseGuildData.deleteMany({ 
                where: {
                    djRole: data!.djRole
                }
            })

            interaction.followUp({
                content: "<:yes:1065688082961158265> | Cargo de DJ removido com sucesso.",
            })
            return;
        }

        if (role) {
            
            await this.client.db.baseGuildData.updateMany({
                where: {
                    guildId: interaction.guild!.id
                },
                data: {
                    djRole: role.id
                }
            })

            interaction.followUp({
                content: "<:yes:1065688082961158265> | Cargo de DJ definido com sucesso.",
            })

            return;
        }
    }
}