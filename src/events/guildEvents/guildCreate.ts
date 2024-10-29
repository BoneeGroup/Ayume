import { Guild, EmbedBuilder, WebhookClient } from "discord.js"
import { Webhook } from "../../others/Config.js"
import Event from "../../structures/Event.js"
import AyumeClient from "../../structures/AyumeClient.js"

export default class GuildCreateEvent extends Event {

    constructor(client: AyumeClient) {
        super(client, {
            name: "guildCreate"
        })
    }

    async run(guild: Guild) {

        const embed = new EmbedBuilder()
        embed.setDescription(`
        ▫️ ID: **${guild.id}**
        ▫️ Dono: ${(await this.client.utils.fetchUsers([guild.ownerId], true)).toString()} (${guild.ownerId})
        ▫️ Número de membros: **${guild.memberCount}**
        ▫️ Criado no dia: **${guild.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}**
        \n▫️ Número de servidores agora: **${this.client.guilds.cache.size}**
        `)
        embed.setFooter({ text: `${guild.shardId} => Cluster ${this.client.cluster.id}` })
        embed.setColor(this.client.data.defaultColor)
        embed.setThumbnail(guild.iconURL({ forceStatic: false }))

        new WebhookClient({
            url: Webhook
        }).send({
            username: this.client.user?.username,
            avatarURL: this.client.user?.displayAvatarURL(),
            content: `🆕 Eu entrei em um novo servidor **${guild.name}**:`,
            embeds: [embed]
        })
    }
}
