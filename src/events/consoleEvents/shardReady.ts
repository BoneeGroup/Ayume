import Event from "../../structures/Event.js"
import AyumeClient from "../../structures/AyumeClient.js"
import Logger from "../../others/Logger.js"
import { ActivityType } from "discord.js"

export default class ShardReady extends Event {

    constructor(client: AyumeClient) {
        super(client, {
            name: "shardReady",
        })
    }

    async run(shard: number) {

        this.client.user!.setPresence({
            activities: [{
                name: `Em desenvolvimento... :)`,
                type: ActivityType.Custom
            }],
            shardId: shard,
        })

        // this.client.user!.setPresence({
        //     activities: [{
        //         name: `the new sweet groove | ${this.client.cluster.id} [${shard}]`,
        //         type: ActivityType.Custom
        //     }],
        //     shardId: shard,
        // })

        Logger.ready(`Shard ${shard} => Cluster ${this.client.cluster.id} is ready!`)
    }
}