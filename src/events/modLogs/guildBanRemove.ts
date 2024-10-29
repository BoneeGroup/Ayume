import Event from "../../structures/Event.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { AuditLogEvent, EmbedBuilder, GuildBan, TextChannel } from "discord.js"

export default class GuildBanRemove extends Event {
    constructor(client: AyumeClient) {
        super(client, {
            name: "guildBanRemove"
        })
    }

    async run(ban: GuildBan) {

        const data = await this.client.db.baseGuildData.findUnique({ where: { guildId: ban.guild.id } })
        if (!data) return;
        const channel = this.client.channels.cache.get(data!.logsChannel) as TextChannel
        
        if (channel) {

            const date = new Date().toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })
    
            const audit = await ban.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberBanRemove
            })
    
            const embed = new EmbedBuilder()
            embed.setColor(this.client.data.defaultColor)
            embed.setDescription([
                `Motivo: **${ban.reason ?? "Nenhum motivo informado"}**`,
                `Desbanido por: **${audit.entries.first()?.executor?.tag}** (ID: ${audit.entries.first()?.executor?.id})`
            ].join("\n"))

            channel.send({
                content: `\`[${date}]\`\nUsuário ${ban.user.tag} (ID: ${ban.user.id}) foi desbanido`,
                embeds: [embed]
            })
        } else { return; }
    }
}