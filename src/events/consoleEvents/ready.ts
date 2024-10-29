import Event from "../../structures/Event.js"
import AyumeClient from "../../structures/AyumeClient.js"
import Logger from "../../others/Logger.js"

export default class ReadyEvent extends Event {

    constructor(client: AyumeClient) {
        super(client, {
            name: "ready"
        })
    }

    async run(client: AyumeClient) {
        Logger.ready("Client is ready for battle :D")
    }
} 