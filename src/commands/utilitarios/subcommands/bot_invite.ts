import { Command, RunCommand } from "../../../structures/Command.js"
import AyumeClient from "../../../structures/AyumeClient.js"

export default class BotInviteSubCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "bot_invite",
            category: "Utilitários",
            description: ".",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

        interaction.followUp({
            content: "<:owoPoiHappy:1103555653714329640> | Que bom que gostou das minhas funcionalidades → [Convite aqui](https://discord.com/api/oauth2/authorize?client_id=683040461434388501&permissions=8&scope=bot%20applications.commands)",
            ephemeral: true
        })

        return;
    }
}