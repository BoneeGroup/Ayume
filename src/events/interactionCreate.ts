import Event from "../structures/Event.js"
import { Command, RunCommand } from "../structures/Command.js"
import AyumeClient from "../structures/AyumeClient.js"
import { Interaction, GuildMember, ChatInputCommandInteraction, PermissionsBitField } from "discord.js"

export default class InteractionCreateEvent extends Event {


    constructor(client: AyumeClient) {
        super(client, {
            name: "interactionCreate"
        })
    }

    async run(interaction: Interaction) {

        if (!interaction.guild?.available) return;

        if (interaction.isAutocomplete()) {

            const command = this.client.commands.get(interaction.commandName)

            if (!command) return;


            command.runAutoComplete({ interaction })
            return;
        }

        if (interaction.isChatInputCommand()) {

            const command = this.client.commands.get(interaction.commandName) ?? this.client.commands.get(interaction.options.getSubcommand())

            const userData = await this.client.db.baseUserData.findUnique({ where: { userId: interaction.user.id } })
            const guildData = await this.client.db.baseGuildData.findUnique({ where: { guildId: interaction.guild.id } })

            if (command) {

                if (!guildData) {
                    await this.client.db.baseGuildData.create({
                        data: {
                            guildId: interaction.guild.id
                        }
                    })
                }

                if (userData?.blacklist) {
                    await interaction.deferReply({ ephemeral: true })

                    interaction.followUp({
                        content: `<:error:1065688085188325466> | Você não pode utilizar comandos pois está na blacklist.\n<:mod:1066612304705241098> | Punido **<t:${userData.punhisedDate}:R>**\n<:warn:1065687746137575504> | Motivo: **${userData.reason}**`
                    })

                    return;
                }

                const member = interaction.member as GuildMember
                if (guildData?.djRole) {
                    const role = interaction.guild?.roles.cache.get(guildData!.djRole)?.name ?? "DJ"

                    if (command.djOnly && !member?.roles.cache.has(guildData!.djRole)) {
                        await interaction.deferReply({ ephemeral: true })
    
                        interaction.followUp({
                            content: `<:error:1065688085188325466> | Apenas pessoas com o cargo \`${role}\` podem usar este comando!`,
                        })
    
                        return;
                    }
                }

                if (command.ownerOnly && !this.client.utils.checkOwner(interaction.user.id)) {
                    await interaction.deferReply({ ephemeral: true })

                    interaction.followUp({ content: "<:error:1065688085188325466> | Você não pode usar este comando!" })

                    return;
                }

                if (!interaction?.inGuild()) {
                    await interaction.deferReply({ ephemeral: true })

                    interaction.followUp({ content: "<:error:1065688085188325466> | Esté comando não pode ser usado fora de um servidor!" })

                    return;
                }

                if (interaction?.inGuild()) {
                    if (!InteractionCreateEvent.checkBotPermissions(interaction, command)) return;
                    if (!InteractionCreateEvent.checkMemberPermissions(interaction, command)) return;
                }

                try {
                    command?.run({ interaction } as RunCommand)
                } catch (error) {
                    await interaction.deferReply({ ephemeral: true })

                    interaction.followUp({ content: `<:warn:1065687746137575504> | Um erro acaba de acontecer\n\`\`\`js\n${error}\`\`\`` })

                    return;
                }
            }
        }
    }

    static checkBotPermissions(interaction: ChatInputCommandInteraction, command: Command): boolean {
        if (command.botPerms.length == 0) return true;
        if (!interaction.guild?.members.me?.permissions.has(command.botPerms)) {
            const permissions = new PermissionsBitField(command.botPerms)
                .toArray()
                .map(p => p)
                .join(', ')
            interaction.reply({
                content: `<:error:1065688085188325466> | Está me faltando permissões para rodar o comando \`${permissions.toString()}\``,
                ephemeral: true
            })
            return false;
        }
        return true;
    }

    static checkMemberPermissions(interaction: ChatInputCommandInteraction, command: Command): boolean {
        if (command.userPerms.length == 0) return true;
        if (!(interaction.member as GuildMember).permissions.has(command.userPerms)) {
            const permissions = new PermissionsBitField(command.userPerms)
                .toArray()
                .map(p => p)
                .join(', ')

            interaction.reply({
                content: `<:error:1065688085188325466> | Você não pode usar esté comando pois está te faltando permissões \`${permissions.toString()}\``,
                ephemeral: true
            })
            return false;
        }
        return true;
    }
}