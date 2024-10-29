import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"
import { ApplicationCommandOptionType } from "discord.js"

export default class VolumeCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "volume",
            description: "「DJ」- Define ou mostra o volume.",
            usage: "[0-100]",
            category: "DJ",
            options: [{
                name: "volume",
                description: "Veja ou mude o volume",
                type: ApplicationCommandOptionType.Number
            }],
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        const player = this.client.lava.players.get(interaction.guild!.id)

        if (!player) {
            await interaction.deferReply({ ephemeral: true })

            interaction.followUp("<:error:1065688085188325466> | Não há nada tocando nada no momento.")

            return;
        }

        const nVolume = player.volume

        var sound;
        if (player.volume > 50) {
            sound = "🔊"
        } else if (player.volume <= 50 && player.volume !== 0) {
            sound = "🔉"
        } else {
            sound = "🔈"
        }

        if (!interaction.options.getNumber("volume")) {
            await interaction.deferReply({ ephemeral: false })

            interaction.followUp({
                content: `${sound} | Volume atual é \`${nVolume}\``
            })

            return;
        }

        if (interaction.options.getNumber("volume", true) < 0 || interaction.options.getNumber("volume", true) > 150) {
            interaction.followUp({
                content: "<:error:1065688085188325466> | O volume deve ser um número válido entre 0 e 100!"
            })

            return;
        }

        player.shoukaku.setGlobalVolume(nVolume)

        await interaction.deferReply({ ephemeral: false })
        interaction.followUp({
            content: `${sound} | Volume definido de \`${nVolume}\` para \`${interaction.options.getNumber("volume", true)}\``
        })
    }
}