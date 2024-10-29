import { Command, RunCommand } from "../../../structures/Command.js"
import AyumeClient from "../../../structures/AyumeClient.js"
import { EmbedBuilder } from "discord.js"

export default class ConfigViewSubCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "config_view",
            description: ".",
            category: "Admin",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

        const data = await this.client.db.baseGuildData.findUnique({ where: { guildId: interaction.guild?.id } })
        
        const embed = new EmbedBuilder()
        embed.setTitle("Configurações do servidor")
        embed.setDescription([
            `**DJ**: ${data?.djRole ? `<@&${data?.djRole}>` : "Nenhum cargo definido"}`,
            `**Canal de logs de moderação**: ${data?.logsChannel ? `<#${data.logsChannel}>` : "Nenhum canal definido"}`,
        ].join("\n"))
        embed.setColor(this.client.data.defaultColor)

        interaction.followUp({
            embeds: [embed]
        })
    }
}