import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { Command, RunCommand } from "../../../structures/Command.js"
import AyumeClient from "../../../structures/AyumeClient.js"

export default class BotInfoSubCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "bot_info",
            category: "Utilitários",
            description: ".",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

        const servers = await this.client.cluster.broadcastEval("this.guilds.cache.size") as number[]
        const allServers = servers.flat(Infinity).reduce((a, b) => a + b)

        const users = await this.client.cluster.broadcastEval("this.guilds.cache.map(g => g.memberCount).reduce((a, g) => a + g, 0)") as number[]
        const allUsers = users.flat(Infinity).reduce((a, b) => a + b)

        const shards = await this.client.cluster.broadcastEval("this.ws.shards.map(s => s.id).reduce((a, g) => a + g, 0)") as number[]
        const allShards = shards.flat(Infinity).reduce((a, b) => a + b)

        const players = await this.client.cluster.broadcastEval("this.lava.players.size") as number[]
        const allPlayers = players.flat(Infinity).reduce((a, b) => a + b)

        const memory = await this.client.cluster.broadcastEval("process.memoryUsage().rss") as number[]

        const embed = new EmbedBuilder()
        embed.setColor(this.client.data.defaultColor)
        embed.setAuthor({ iconURL: this.client.user!.avatarURL({ size: 4096 }) ?? "", name: this.client.user!.username })
        embed.setDescription([
            `Heyo, eu sou a **${this.client.user!.username}**! um bot de música e moderação que está em desenvolvimento.`,
            `Fui criada <t:${~~(this.client.user!.createdTimestamp / 1000)}:R> ( <t:${~~(this.client.user!.createdTimestamp / 1000)}:F> )`,
        ].join("\n"))

        embed.addFields([
            {
                name: "Estatísticas",
                value: [
                    `🖥️ Servidores: **${allServers.toLocaleString()}**`,
                    `🤖 Usuários: **${allUsers.toLocaleString()}**`,
                    `📚 Shards: **${allShards.toLocaleString()}**`,
                    `🎵 Players: **${allPlayers.toLocaleString()}**`,
                    `💾 Memória: **${this.client.utils.formatBytes(memory.flat(Infinity).reduce((a, b) => a + b, 0))}**`,
                    `🕛 Uptime: **${this.client.utils.time(this.client!.uptime ?? 0)}**`
                ].join("\n")
            }
        ])

        const inviteButton = new ButtonBuilder({
            style: ButtonStyle.Link,
            label: "Me convide",
            url: `https://discord.com/api/oauth2/authorize?client_id=${this.client.user!.id}&permissions=8&scope=bot%20applications.commands`
        })

        const supportButton = new ButtonBuilder({
            style: ButtonStyle.Link,
            label: "Servidor de suporte",
            url: "https://discord.gg/WZWGgjNCjV"
        })


        const actionRow = new ActionRowBuilder<ButtonBuilder>()
        actionRow.addComponents([inviteButton, supportButton])

        interaction.followUp({
            embeds: [embed],
            components: [actionRow]
        })
    }
}