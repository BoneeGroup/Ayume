import { ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, ActionRowBuilder, ApplicationCommandOptionType } from "discord.js"
import { Command, RunAutoComplete, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"

export default class HelpCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "help",
            category: "Utilitários",
            description: "「Utilitários」- Mostra a lista de comandos.",
            usage: "[comando]",
            options: [{
                name: "comando",
                description: "Ver informaçoes de um comando específico",
                type: ApplicationCommandOptionType.String,
                autocomplete: true
            }]
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        if (!interaction.options.getString("comando")) {
            const embed0 = new EmbedBuilder()

            embed0.setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: false, size: 4096 })
            })

            embed0.setColor(this.client.data.defaultColor)

            embed0.setDescription([
                `👋 | Eu tenho atualmente **${this.client.commands.size}** comandos.`,
                `:tools: | Você pode pedir suporte e ficar por dentro das novidades no meu [servidor](https://discord.gg/WZWGgjNCjV).`,
                `:question: | Você pode pedir ajuda para um comando específico, usando \`${this.client.data.prefix}help [comando]\`.`,
                `⚙️ | Clique nos emojis abaixo para ver os comandos de cada categoria.`,
                ``,
                `👑 | Fui desenvolvida por ${await (this.client.utils.fetchUsers(this.client.data.owners, true))}.`,
            ].join("\n"))

            embed0.setTimestamp()

            const pages = [embed0]
            try {
                const helpString = []
                const categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== "Desenvolvedor").map(cmd => cmd.category))
                for (const category of categories) {
                    helpString.push(this.client.commands.filter(cmd => cmd.category === category && cmd.showInHelp === true).map(cmd => `\`/${cmd.data.name} ${cmd.subCommands?.join(" | ") ?? ""}\` → ${cmd.data.description.split("- ")[1]}${cmd.usage ? `\n⤷ Modo de uso → \`${cmd.usage}\`` : ""}`))
                }

                //const pages = [embed0]
                for (var i = 0; i < helpString.length; i++) {

                    const embed = new EmbedBuilder()
                    embed.setColor(this.client.data.defaultColor)
                    embed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ forceStatic: false, size: 4096 }) })
                    embed.setDescription(helpString[i].join("\n"))
                    embed.setTitle(`Categoria: ${categories[i]}`)
                    embed.setTimestamp()
                    embed.setFooter({
                        text: `Página ${i + 1}/${helpString.length}`
                    })

                    pages[0].setFooter({
                        text: `Página 0/${helpString.length}`
                    })

                    pages.push(embed)
                }
            } catch (e) {
                console.log(e)
            }

            const forwardButton = new ButtonBuilder({
                label: "Proxima página",
                customId: `forward_${interaction.user.id}`,
                style: ButtonStyle.Primary
            })

            const backwardButton = new ButtonBuilder({
                label: "Página anterior",
                customId: `backward__${interaction.user.id}`,
                style: ButtonStyle.Primary
            })

            const row = new ActionRowBuilder<ButtonBuilder>()
            row.addComponents([backwardButton, forwardButton])

            const msg = await interaction.followUp({
                embeds: [embed0],
                components: [row]
            })

            const collector = msg.createMessageComponentCollector({
                filter: (i) => {
                    if ([`forward_${interaction.user.id}`, `backward__${interaction.user.id}`].includes(i.customId)) {
                        if (i.user.id !== interaction.user.id) {
                            i.reply({
                                content: "<:error:1065688085188325466> | Apenas o autor pode usar os botões.",
                                ephemeral: true
                            })
                            return false
                        }
                        return true
                    }
                    return false
                },
                componentType: ComponentType.Button,
                time: 60000
            })

            var page = 0
            collector.on("collect", async (i) => {

                if (i.customId == `forward_${interaction.user.id}`) {
                    page = page + 1 < pages.length ? ++page : 0

                    await i.deferUpdate()

                    i.editReply({
                        embeds: [pages[page]],
                        components: [row]
                    })

                    collector.resetTimer()
                    return;
                }

                if (i.customId == `backward__${interaction.user.id}`) {
                    page = page > 0 ? --page : pages.length - 1

                    await i.deferUpdate()

                    i.editReply({
                        embeds: [pages[page]],
                        components: [row]
                    })

                    collector.resetTimer()
                    return;
                }
            })

            collector.on("end", () => {
                msg.edit({
                    components: []
                }).catch(() => { })

                return;
            })
        } else {

            const command = this.client.commands.get(interaction.options.getString("comando", true))

            if (!command) {

                interaction.followUp({
                    content: "<:error:1065688085188325466> | Não encontrei este comando.",
                })

                return;
            }

            const embed = new EmbedBuilder()
            embed.setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: false, size: 4096 })
            })

            embed.setColor(this.client.data.defaultColor)
            embed.setDescription([
                `📚 | **Nome**: \`${command.data.name}\` → \`${command.data.description}\``,
                `📋 | **Uso**: \`${this.client.data.prefix}${command.data.name} ${command.usage}\``,
                `📝 | **Categoria**: \`${command.category}\``,
                `${command.subCommands ? `📖 | **Sub comandos**: \`${command.subCommands.join(" | ")}\`` : ""}`
            ].join("\n"))

            embed.setFooter({
                text: `Isso [] é opcional e <> é obrigatório.`
            })

            interaction.followUp({
                embeds: [embed]
            })
        }
    }

    async runAutoComplete({ interaction }: RunAutoComplete) {

        const commandsList = this.client.commands.filter(cmd => cmd.showInHelp === true && cmd.category !== "Desenvolvedor")

        if (!commandsList || commandsList.size == 0) {

            interaction.respond([{ value: "undefined", name: `Não foi localizado nenhum comando.` }])
            return;
        }

        interaction.respond(commandsList.map(cmd => ({ value: cmd.data.name, name: cmd.data.name })))

    }
}