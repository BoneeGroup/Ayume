import { Connectors } from "shoukaku"
import { Kazagumo, KazagumoPlayer, KazagumoTrack } from "kazagumo"
import { EmbedBuilder, TextChannel, ChatInputCommandInteraction } from "discord.js"
import AyumeClient from "../structures/AyumeClient.js"
import { Nodes } from "../others/Config.js"
import Logger from "../others/Logger.js"

export class FuyumiLavaPlayer extends Kazagumo {

    constructor(client: AyumeClient) {
        super({
            defaultSearchEngine: "youtube",
            send: (guildId, payload) => {
                const guild = client.guilds.cache.get(guildId)
                if (guild) guild.shard.send(payload)
            },
        }, new Connectors.DiscordJS(client), Nodes, {
            userAgent: "Ayume",
            moveOnDisconnect: true,
            resumeByLibrary: true,
            resume: true
        })

        this.shoukaku.on("ready", (name) => Logger.ready(`Lavalink ${name}: Ready!`))

        this.shoukaku.on("error", (name, error) => Logger.error(`Lavalink ${name} found a error: ${error.message}`))

        this.shoukaku.on("disconnect", (name, count) => {
            Logger.warn(`Lavalink Node: ${name} is disconnected. Moved: ${count}`)
        })

        this.on("playerMoved", (player, state, channels) => {
            player.setVoiceChannel(channels.newChannelId ?? "")
        })

        this.on("playerClosed", (player, data) => {
            if (data.byRemote) {
                player.destroy()
            }
        })

        // @ts-ignore
        this.on("playingNow", async (player: KazagumoPlayer, track: KazagumoTrack, interaction: ChatInputCommandInteraction) => {

            const data = await client.db.mostPlayed.findUnique({ where: { id: track.identifier } })
            const count = data?.count ? data.count + 1 : 1

            if (!data) {
                await client.db.mostPlayed.create({
                    data: {
                        id: track.identifier,
                        count: count,
                        url: track.uri,
                        title: track.title
                    }
                })
            } else {
                await client.db.mostPlayed.update({
                    where: { id: track.identifier },
                    data: {
                        count: data.count + 1
                    }
                })
            }

            const embed = new EmbedBuilder()
            embed.setDescription(`🎵 | Tocando agora **${track.title}**`)
            embed.setColor(client.data.defaultColor)

            interaction.followUp({
                embeds: [embed]
            }).then(msg => player.data.set("message", msg)).catch(() => { })
        })

        // @ts-ignore
        this.on("newTrackStart", async (player: KazagumoPlayer, tracks: KazagumoTrack[]) => {
            const track = tracks[1]

            const channel = client.channels.cache.get(player.textId ?? "") as TextChannel

            const data = await client.db.mostPlayed.findUnique({ where: { id: track.identifier } })
            const count = data?.count ? data.count + 1 : 1

            if (!data) {
                await client.db.mostPlayed.create({
                    data: {
                        id: track.identifier,
                        count: count,
                        url: track.uri,
                        title: track.title
                    }
                })
            } else {
                await client.db.mostPlayed.update({
                    where: { id: track.identifier },
                    data: {
                        count: data.count + 1
                    }
                })
            }

            const embed = new EmbedBuilder()
            embed.setColor(client.data.defaultColor)
            embed.setDescription(`🎵 | Tocando agora **${track.title}**`)

            channel.send({
                embeds: [embed]
            }).then(msg => player.data.set("message", msg)).catch(() => { })
        })

        this.on("playerEnd", async (player) => {
            // @ts-ignore
            this.emit("newTrackStart", player, [player.queue.previous, ...player.queue])

            player.data.get("message").delete().catch(() => { })
        })

        this.on("playerException", console.log)

        this.on("playerEmpty", async (player) => {
            const channel = client.channels.cache.get(player.textId ?? "") as TextChannel

            channel.send({ content: "👋 | A fila de reprodução acabou." })

            player.destroy()
        })
    }
}