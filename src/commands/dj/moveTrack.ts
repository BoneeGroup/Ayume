import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { ApplicationCommandOptionType } from "discord.js"

export default class MoveTrackCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "move",
            description: "「DJ」- Move uma música da fila atual para uma posição diferente.",
            options: [{
                name: "track",
                description: "「DJ」- Move uma música da fila atual para uma posição diferente.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "de",
                        description: "Possição da música que deseja mover",
                        type: ApplicationCommandOptionType.Number,
                        required: true
                    },
                    {
                        name: "para",
                        description: "Possição para ser movida",
                        type: ApplicationCommandOptionType.Number,
                        required: true
                    }
                ],
            }],
            subCommands: ["track"],
            category: "DJ",
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const player = this.client.lava.players.get(interaction.guild!.id)

        const options = {
            from: interaction.options.getNumber("de", true),
            to: interaction.options.getNumber("para", true)
        }

        // @ts-ignore
        if ((options.from > player?.queue.totalSize) && (options.from && !player?.queue[options.from])) {
            interaction.followUp({
                content: `<:error:1065688085188325466> | \`${options.from}\` não é uma posição valida na fila de música!`
            })
        }

        // @ts-ignore
        if ((options.now > player?.queue.totalSize) && (options.from && !player?.queue[options.to])) {
            interaction.followUp({
                content: `<:error:1065688085188325466> | \`${options.to}\` não é uma posição valida na fila de música!`
            })
            return;
        }

        if (options.to == 0) {
            interaction.followUp({
                content: `<:error:1065688085188325466> | Não é possível mover uma música que já esteja tocando. Para pular a música que está tocando, digite: \`/skip\``
            })
            return;
        }

        const song = player?.queue[options.from - 1]

        player?.queue.splice(options.from - 1, 1)
        // @ts-ignore
        player?.queue.splice(options.to - 1, 0, song)
        interaction.followUp({
            content: `<:yes:1065688082961158265> | Movido **${song?.title}** de \`${options.from}\` para \`${options.to}\``
        })
    }
}