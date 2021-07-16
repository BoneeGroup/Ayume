const Event = require("../../Structures/Event")

module.exports = class extends Event {

    async run(interaction) {

        if (!interaction.isCommand()) return

        await interaction.defer()

        if (!interaction.guildId || !interaction.channelId) {
            return interaction.editReply("Comandos ainda não podem ser executados através de mensagens diretas! Vá em um servidor e tente novamente :heart:");
        }
        
        if (!interaction.client.guilds.cache.get(interaction.guildId)) {
            return interaction.editReply("Eu não fui adiciona corretamente no servidor! Me adicione através [deste link](https://ayume.bonee.xyz/add)");
        }

        const serverPrefix = db.get(`${interaction.guild.id}_prefix`) || this.client.prefix

        interaction.author = interaction.user

        interaction.content = `${serverPrefix}${interaction.commandName} ${interaction.options.size > 0 ? interaction.options.map(i => i.value) : ""}`.trim()

        interaction.slash = true

        let response = false

        interaction.reply = async (c, o) => {
            if (!response) {
                response = true
                return interaction.editReply(c, o)
            } else {
                return this.client.channels.cache.get(interaction.channel.id).send(c, o)
            }
        }

        interaction.edit = async (c, o) => {
            if (!response) {
                response = true;
                return interaction.editReply(c, o)
            } else {
                return this.client.channels.cache.get(interaction.channel.id).send(c, o)
            }
        }

        this.client.emit("messageCreate", interaction)
    }
}