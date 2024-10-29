import Event from "../../structures/Event.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { Message, EmbedBuilder, TextChannel, escapeMarkdown } from "discord.js"

export default class MessageDeleteEvent extends Event {
    constructor(client: AyumeClient) {
        super(client, {
            name: "messageDelete"
        })
    }

    async run(message: Message) {

        const data = await this.client.db.baseGuildData.findUnique({ where: { guildId: message.guild!.id } })
        if (!data) return;
        const channel = this.client.channels.cache.get(data!.logsChannel) as TextChannel

        if (channel) {

            if (message.author.bot) return;

            if (message.stickers?.size) return;
    
            if (message.attachments?.size) return;
    
            const date = new Date().toLocaleString("pt-BR", { 
                timeZone: "America/Sao_Paulo",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit" 
            })
    
            const embed = new EmbedBuilder()
            embed.setColor(this.client.data.defaultColor)
            embed.setDescription(escapeMarkdown(message?.content.slice(0, 2000) ?? "Falha ao obter mensagem"))

            
            channel.send({
                content: `\`[${date}]\`\nMensagem de ${message.author ? message.author.tag : "Unknown#0000"} (ID: ${message.author ? message.author.id : "00"}) foi deletada em <#${message.channelId}>`,
                embeds: [embed]
            })
        } else { return; }
    }
}