import AyumeClient from "../../structures/AyumeClient.js"
import { Command, RunCommand } from "../../structures/Command.js"

export default class PingCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "ping",
            description: "「Utilitários」- Mostra o ping do bot.",
            category: "Utilitários"
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: true, fetchReply: true })

        const msg = await interaction.followUp({ content: "🏓" })
        const tLatency = msg.createdTimestamp - interaction.createdTimestamp

        await interaction.editReply({
            content: `Ping: ${tLatency}ms\nWebSocket: ${Math.round(this.client.ws.ping)}ms`
        })
    }
}