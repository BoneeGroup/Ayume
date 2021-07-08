const Command = require("../../Structures/Command")
const AsciiTable = require('ascii-table')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "lavalink",
            description: { 
                pt: "Mostra as estatísticas do lavalink",
                en: "Displays the bot's lavalink stats"
            },
            category: "Utilidades",
            guildOnly: false,
            enabled: true
        })
    }

    async run({ message }, lang) {

        const {
            memory,
            uptime,
            players,
            cpu
        } = this.client.music.nodes.first().stats


        let table = new AsciiTable('Ayume nodes')

        table.setHeading('SID', lang.lavalink.memory, 'Uptime', 'Players', 'CPU')

        table.setAlign(0, AsciiTable.CENTER)
        table.setAlign(1, AsciiTable.CENTER)
        table.setAlign(2, AsciiTable.CENTER)
        table.setAlign(3, AsciiTable.CENTER)
        table.setAlign(4, AsciiTable.CENTER)

        table.setBorder('|', '-', '+', '+')

        table.addRow(1, this.client.utils.formatBytes(memory.used), this.client.utils.time(uptime), players, (cpu.lavalinkLoad * 100).toFixed(2) + "%")

        await message.reply(`\`\`\`prolog\n${table.toString()}\`\`\``)

        return table.clearRows()
    }
}