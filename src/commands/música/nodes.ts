import { APIEmbedField, EmbedBuilder } from "discord.js"
import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"

export default class nodesCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "nodes",
            description: "「Música」 - Mostra as informaçoes sobre os nodes de música.",
            category: "Música"
        })
    }

    async run({ interaction }: RunCommand) {

        const player = this.client.lava.getPlayer(interaction.guild!.id)?.shoukaku.node

        const nodes = Array.from(this.client.lava.shoukaku.nodes, ([name, value]) => ({ name, value }))

        const playingPlayers = nodes.map(n => n.value.stats?.playingPlayers ?? 0)
        const totalPlayingPlayers = playingPlayers.reduce((a, b) => a + b, 0)

        const players = nodes.map(n => n.value.stats?.players ?? 0)
        const totalPlayers = players.reduce((a, b) => a + b, 0)

        const memory = nodes.map(n => n.value.stats?.memory.used ?? 0)
        const totalMemory = memory.reduce((a, b) => a + b, 0)

        const fields: APIEmbedField[] = []
        for (const node of nodes) {
            fields.push({ 
                name: node.value.name,
                value: `\`\`\`\n${player?.name == node.name ? "» " : ""}Players: ${node.value.stats?.playingPlayers ?? 0} / ${node.value.stats?.players ?? 0}\nUptime: ${this.client.utils.time(node.value.stats?.uptime ?? 0)}\nRAM: ${this.client.utils.formatBytes(node.value.stats?.memory.used ?? 0)}\nPing:${node.value.ws?.ping}ms\`\`\``,
                inline: true
            })
        }

        const embed = new EmbedBuilder()
        embed.setColor(this.client.data.defaultColor)
        embed.setTitle("Informações gerais")
        embed.setDescription(`\`\`\`fix\nPlayers: ${totalPlayingPlayers} / ${totalPlayers}\nRAM: ${this.client.utils.formatBytes(totalMemory)}\`\`\``)
        embed.addFields(fields)
    
        interaction.reply({ embeds: [embed] })
    }
}