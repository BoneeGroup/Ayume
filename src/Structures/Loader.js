const website = require("../Website/index")

module.exports = class Loader {
    constructor(client) {
        this.client = client
    }

    async start() {

        new website(this.client).startWebServer()

        const DataBaseManager = require("denky-database")

        global.db = new DataBaseManager("./src/System/db.json")

        global.owner = await this.client.users.fetch("672652538880720896")

        this.client.settings = {}
        this.client.settings.color = "b4a4c3"
        this.client.settings.version = "2.3.0"
        this.client.settings.voiceLeave = 30000

        this.client.lang = {}
        this.client.lang.en = require("../Locales/en-US.json")
        this.client.lang.pt = require("../Locales/pt-BR.json")

        this.client.lang.permissions = {}
        this.client.lang.permissions.en = require("../Locales/Permissions/en-US.json")
        this.client.lang.permissions.pt = require("../Locales/Permissions/pt-BR.json")
    }
}