import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { AttachmentBuilder, ApplicationCommandOptionType } from "discord.js"
import { createCanvas, registerFont, loadImage, Image } from "canvas"
import getColor from "get-image-colors"
import { glob } from "glob"

export default class nowPlayingCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "now",
            description: "「Música」- Mostra a música que está tocando no momento.",
            category: "Música",
            subCommands: ["playing"],
            options: [{
                name: "playing",
                description: "「Música」- Mostra a música que está tocando no momento.",
                type: ApplicationCommandOptionType.Subcommand
            }]
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ fetchReply: true })

        const player = this.client.lava.getPlayer(interaction.guild!.id)

        if (!player) {
            interaction.followUp({
                content: "<:error:1065688085188325466> | Não tem nada tocando no servidor."
            })

            return;
        }

        const canvas = createCanvas(1080, 1560)
        const ctx = canvas.getContext("2d")

        const f = await glob("./src/images/*.ttf", { absolute: true })
        registerFont(f[0], { family: "poppins", style: "SemiBold" })


        // Pintar o fundo
        ctx.beginPath()
        const thumb = player.queue.current?.thumbnail ?? ""
        const colors = await getColor(thumb)
        const gradient = ctx.createLinearGradient(0, 0, 1560, 1080)
        gradient.addColorStop(1.3, colors[1].hex("rgb"))
        gradient.addColorStop(0.3, colors[0].hex("rgb"))

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.closePath()

        /* Nome da música */
        ctx.beginPath()
        ctx.fillStyle = "#FFFFFF"
        ctx.font = '70px "Poppins-SemiBold"'
        ctx.fillText(player.queue.current!.title.slice(0, 19), 70, 1029)
        ctx.closePath()

        /* Nome do autor */
        ctx.beginPath()
        ctx.fillStyle = "#D9D9D9"
        ctx.font = '30px "Poppins-SemiBold"'
        ctx.fillText(player.queue.current!.author ?? "Desconhecido", 70, 1118)
        ctx.closePath()

        /* Primeira barra */
        ctx.beginPath()
        ctx.fillStyle = "#7E6C67"
        ctx.strokeStyle = "#7E6C67"
        ctx.globalAlpha = 0.5
        ctx.roundRect(70, 1164, 930, 30, 15)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        /* Segunda barra */
        ctx.beginPath()
        const current = player.position
        const total = player.queue.current?.length ?? 0
        const progess = Math.round((650 * current) / total)

        ctx.fillStyle = "#FFFFFF"
        ctx.strokeStyle = "#FFFFFF"
        ctx.globalAlpha = 0.5

        // Bolinha
        ctx.arc(progess + 65, 1179, 15, 0, 2 * Math.PI)
        ctx.fill()

        // Barra
        ctx.roundRect(70, 1164, progess, 30, 15)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        /* Tempo atual */
        ctx.beginPath()
        ctx.fillStyle = "#FFFFFF"
        ctx.font = '25px "Poppins-SemiBold"'
        ctx.fillText(this.client.utils.formatDuration(player.position), 944, 1213)
        ctx.closePath()

        /* Tempo total da música */
        ctx.beginPath()
        ctx.fillStyle = "#FFFFFF"
        ctx.font = '25px "Poppins-SemiBold"'
        ctx.fillText(this.client.utils.formatDuration(player.queue.current!.length ?? 0), 70, 1213)
        ctx.closePath()

        const file = new AttachmentBuilder(canvas.createPNGStream(), { name: `now_playing_${interaction.id}.png` })

        interaction.editReply({ content: "console", files: [file] })
    }
}