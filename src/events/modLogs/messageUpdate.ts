import Event from "../../structures/Event.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { Message, EmbedBuilder, TextChannel, escapeMarkdown } from "discord.js"

export default class MessageUpdateEvent extends Event {
    constructor(client: AyumeClient) {
        super(client, {
            name: "messageUpdate"
        })
    }

    async run(oldMessage: Message, newMessage: Message) {

        const data = await this.client.db.baseGuildData.findUnique({ where: { guildId: oldMessage.guild!.id } })
        if (!data) return;
        const channel = this.client.channels.cache.get(data!.logsChannel) as TextChannel

        if (channel) {

            if (oldMessage.author.bot) return;

            if (oldMessage.content == newMessage.content) return;
    
            if (oldMessage.attachments?.size) return;
    
            const date = new Date().toLocaleString("pt-BR", { 
                timeZone: "America/Sao_Paulo",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit" 
            })
    
            const embed = new EmbedBuilder()
            embed.setColor(this.client.data.defaultColor)
            embed.setDescription(`[Link da mensagem](${newMessage.url})`)
            embed.addFields([
                { name: "Mensagem antiga", value: escapeMarkdown(oldMessage?.content.slice(0, 2000) ?? "Falha ao obter mensagem") },
                { name: "Nova mensagem", value: escapeMarkdown(newMessage?.content.slice(0, 2000))}
            ])

            
            channel.send({
                content: `\`[${date}]\`\nMensagem de ${newMessage ? newMessage.author.tag : "Unknown#0000"} (ID: ${newMessage ? newMessage.author.id : "00"}) foi editada em <#${newMessage.channelId}>`,
                embeds: [embed]
            })
        } else { return; }
    }
}