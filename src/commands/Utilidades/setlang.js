const Command = require("../../Structures/Command")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "setlang",
            aliases: ['lang'],
            category: "Utilidades",
            description: {
                pt: "Muda o idioma do bot",
                en: "Change the bot language"
            },
            enabled: true,
            userPerms: ["MANAGE_GUILD"]
        })
    }

    async run({ message }, lang) {

        let brazil = new MessageButton()
        brazil.setCustomId("brazil")
        brazil.setLabel("Português")
        brazil.setStyle("PRIMARY")
        brazil.setEmoji("🇧🇷")

        let us = new MessageButton()
        us.setCustomId("us")
        us.setLabel("English")
        us.setStyle("PRIMARY")
        us.setEmoji("🇺🇸")

        let x = new MessageButton()
        x.setCustomId("x")
        x.setLabel(lang.lang.cancel)
        x.setStyle("PRIMARY")
        x.setEmoji("❌")


        const filter = i => ["x", "us", "brazil"].includes(i.customId)

        let embed = new MessageEmbed()
        embed.setDescription("🇧🇷 **Português**\n🇺🇸 **English**")
        embed.setAuthor(lang.lang.select,  message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
        embed.setTimestamp()
        embed.setColor(message.guild.me.roles.highest.color || this.client.settings.color)

        const collector = message.channel.createMessageComponentCollector({ filter, time: 120000, idle: 120000 })

        switch (db.get(`${message.guild.id}_lang`)) {
            case "en-US":
                us.setDisabled(true)
                us.setStyle("DANGER")
            break;

            case undefined:
                brazil.setDisabled(true)
                brazil.setStyle("DANGER")
            break;
        }

        let row = new MessageActionRow()
        row.addComponents([brazil, us, x])

        brazil.setDisabled(true)
        x.setDisabled(true)
        us.setDisabled(true)

        let disabledRow = new MessageActionRow()
        disabledRow.addComponents([brazil, us, x])

        let msg = await message.reply({ embeds: [embed], components: [row] })

        collector.on("collect", async (button) => {

            if (collector.users.first().id !== message.author.id) {
                return await button.reply({ content: lang.lang.authorOnly, ephemeral: true })
            }

            switch(button.customId) {
                case 'brazil':
                    await button.deferUpdate().catch()
                    await msg.edit({
                        embeds: [{
                            description: "Falarei Português neste servidor.",
                            color: message.guild.me.roles.highest.color || this.client.settings.color,
                            timestamp: Date.now()
                        }],
                        components: [disabledRow]
                    })
                    db.delete(`${message.guild.id}_lang`)
                    collector.stop()
                break;

                case 'us':
                    await button.deferUpdate().catch()
                    await msg.edit({
                        embeds: [{
                            description: "I will speak English on this server.",
                            color: message.guild.me.roles.highest.color || this.client.settings.color,
                            timestamp: Date.now()
                        }],
                        components: [disabledRow]
                    })
                    db.set(`${message.guild.id}_lang`, "en-US")
                    collector.stop()
                break;

                case 'x':
                    await button.deferUpdate().catch()
                    await msg.edit({
                        embeds: [{
                            description: lang.lang.closed,
                            color: message.guild.me.roles.highest.color || this.client.settings.color,
                            timestamp: Date.now()
                        }],
                        components: [disabledRow]
                    })
                    collector.stop()
                break;
            }
        })
    }
}