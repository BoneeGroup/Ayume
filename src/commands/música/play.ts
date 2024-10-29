import { ApplicationCommandOptionType, ChannelType, EmbedBuilder, GuildMember } from "discord.js"
import { KazagumoPlayer } from "kazagumo"
import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"

export default class PlayCommnad extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "play",
            description: "「Música」- Toca uma música ou adicione uma à fila.",
            category: "Música",
            options: [{
                name: "query",
                description: "Música ou playlist para escutar",
                required: true,
                type: ApplicationCommandOptionType.String
            }]
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ fetchReply: true })

        const query = interaction.options.getString("query", true)

        const member = interaction.member as GuildMember
        const { channel } = member.voice

        if (!channel) {
            interaction.followUp({ content: "<:error:1065688085188325466> | Você não está em nenhum canal de voz." })

            return;
        }

        if (!this.client.lava.players.get(interaction.guild!.id)) {

            if (!channel.joinable) {
                interaction.followUp({ content: "<:error:1065688085188325466> | Não consigo entrar no canal de voz solicitado." })
    
                return;
            }

            await this.client.lava.createPlayer({
                guildId: interaction.guild!.id,
                textId: interaction.channel!.id,
                voiceId: channel.id,
                deaf: true,
                volume: 100,
                shardId: interaction.guild!.shardId
            })
        }

        const player = this.client.lava.players.get(interaction.guild!.id) as KazagumoPlayer

        if (player.voiceId !== channel.id) {
            interaction.followUp({ content: `<:error:1065688085188325466> | Estou tocando música em \`${interaction.guild!.channels.cache.get(player?.voiceId ?? "")?.name}\`` })

            return;
        }

        const res = await player.search(query, { 
            requester: interaction.user
        })

        if (!res.tracks.length) {
            interaction.followUp({ content: "<:error:1065688085188325466> | Não localizei nenhuma música." })

            player!.destroy()
            return;
        }

        if (res.type == "PLAYLIST") {

            for (const track of res.tracks) player.queue.add(track)

            if (!player.playing && !player.paused) player.play()
            
            const embed = new EmbedBuilder()
            embed.setColor(this.client.data.defaultColor)

            if (!player.playing) {
                embed.setDescription(`📻 | Adicionado a fila de espera a playlist **${res.playlistName}** e tocando a música **${res.tracks[0].title}**.`)
            } else {
                embed.setDescription(`📻 | Adicionado a playlist **${res.playlistName}** na fila de espera.`)
            }

            interaction.followUp({ embeds: [embed] })

            return;
        }

        if (res.type == "SEARCH") {

            player.queue.add(res.tracks[0])

            if (!player.playing && !player.paused && !player.queue.size) player!.play()

            if (player.queue.size >= 1) {

                const embed = new EmbedBuilder()
                embed.setColor(this.client.data.defaultColor)
                embed.setDescription(`🎵 | Adicionado a lista de espera **${res.tracks[0].title}**`)

                interaction.followUp({
                    embeds: [embed]
                })

                return;

            } else {
                // @ts-ignore
                this.client.lava.emit("playingNow", player, res.tracks[0], interaction)

                return;
            }
        }

        if (res.type == "TRACK") {

            player.queue.add(res.tracks[0])

            if (!player.playing && !player.paused && !player.queue.size) player.play()

            if (player.queue.size >= 1) {

                const embed = new EmbedBuilder()
                embed.setColor(this.client.data.defaultColor)
                embed.setDescription(`🎵 | Adicionado a lista de espera **${res.tracks[0].title}**`)

                interaction.followUp({
                    embeds: [embed]
                })

                return;

            } else {
                // @ts-ignore
                this.client.lava.emit("playingNow", player, res.tracks[0], interaction)

                return;
            }
        }
    }
}