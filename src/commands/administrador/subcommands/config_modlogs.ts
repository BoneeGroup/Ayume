import { RunCommand, Command } from "../../../structures/Command.js"
import AyumeClient from "../../../structures/AyumeClient.js"

export default class ConfigModLogsSubCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "config_modlogs",
            description: ".",
            category: "Admin",
            showInHelp: false,
            isSubCommand: true
        })
    }

    async run({ interaction }: RunCommand) {

        const channel = interaction.options.getChannel("canal")

        const data = await this.client.db.baseGuildData.findUnique({ where: { guildId: interaction.guild?.id } })

        if (!channel && !data?.logsChannel) {
            interaction.followUp({
                content: "<:error:1065688085188325466> | Você não definiu um canal de logs de moderação.",
            })

            return;
        }

        if (!channel && data?.logsChannel) {

            await this.client.db.baseGuildData.deleteMany({
                where: {
                    logsChannel: data!.logsChannel
                }
            })

            interaction.followUp({
                content: "<:yes:1065688082961158265> | Canal de logs de moderação removido com sucesso.",
            })

            return;
        }

        if (channel) {
            
            await this.client.db.baseGuildData.updateMany({
                where: {
                    guildId: interaction.guild!.id
                },
                data: {
                    logsChannel: channel!.id
                }
            })

            interaction.followUp({
                content: "<:yes:1065688082961158265> | Canal de logs de moderação definido com sucesso.",
            })
        }
    }
}