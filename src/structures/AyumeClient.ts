import { Client, Collection, GatewayIntentBits, PermissionResolvable } from "discord.js"
import { getInfo, ClusterClient } from "discord-hybrid-sharding"
import { PrismaClient } from "@prisma/client"
import { ClientConfig } from "../others/Config.js"
import { Command } from "./Command.js"
import Event from "./Event.js"
import Utils from "./Utils.js"
import { FuyumiLavaPlayer } from "../lavalink/index.js"

export default class AyumeClient extends Client {

    data: typeof ClientConfig
    defaultPerms!: PermissionResolvable[]
    commands: Collection<string, Command>
    events: Collection<string, Event>
    utils: Utils
    db: PrismaClient
    lava: FuyumiLavaPlayer
    cluster: ClusterClient<AyumeClient>

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildVoiceStates,
            ],
            shardCount: getInfo().TOTAL_SHARDS,
            shards: getInfo().SHARD_LIST,
            allowedMentions: {
                parse: [
                    "users",
                    "roles"
                ]
            }
        })

        this.data = ClientConfig

        this.commands = new Collection()

        this.events = new Collection()

        this.lava = new FuyumiLavaPlayer(this)

        this.cluster = new ClusterClient(this)

        this.db = new PrismaClient()

        this.utils = new Utils(this)
    }

    async start() {
        await this.utils.loadCommands()
        await this.utils.loadEvents()
        if (this.cluster.id == 0) await this.utils.postCommands()
        await super.login(this.data.token)
    }
}