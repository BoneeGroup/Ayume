const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "debug",
            category: 'Desenvolvedor',
            enabled: true,
            ownerOnly: true
        })
    }

    async run({ message }) {

        message.reply(this.client.ws.shards.map(s => "```js\n" + `[Shard ${s.id}] ${this.client.guilds.cache.filter(g => g.shardId === s.id).size} servidores | ${s.ping}ms` + "```").join("\n"))
    }
}