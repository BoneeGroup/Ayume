const { join } = require('path')
const express = require('express')
const app = express()

app.use(express.static(join(__dirname, "frontend")))

module.exports = class WebSite {
    constructor(client) {
        this.client = client
    }

    startWebServer() {

        let command = this.client.commands.filter(a => a.category !== "Desenvolvedor").map(({ category, name, aliases, description }) => {
            return { category, name, aliases, description }
        })

        app.get("/api/stats", (req, res) => {
            res.json({
                guilds: this.client.guilds.cache.size,
                users: this.client.guilds.cache.map(g => g.memberCount).reduce((a, g) => a + g),
                ping: this.client.ws.ping
            })
        })

        app.get("/api/commands", (req, res) => {
            res.json(command)
        })

        app.get("/add", (req, res) => {
            res.redirect("https://discord.com/oauth2/authorize?client_id=716080166291374124&permissions=2150976576&scope=bot%20applications.commands")
        })

        app.listen(80, () => {
            console.log(`[WEBSITE] - Online`.green)
        })
    }
}

