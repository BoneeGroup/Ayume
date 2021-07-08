const Event = require("../../Structures/Event")
module.exports = class extends Event {

    async run() {

        this.client.music.init(this.client.user.id)

        console.log("[LOGIN] - Iniciado com sucesso".green)

        this.client.user.setPresence({
            activities: [{ 
                name: `for /help | ${this.client.ws.ping}ms`,
                type: 5,
            }]
        })

        setInterval(() => {
            this.client.user.setPresence({
                activities: [{ 
                    name: `for /help | ${this.client.ws.ping}ms`,
                    type: 5,
                }]
            })
        }, 60000)
    }
}