import { ClusterManager } from "discord-hybrid-sharding"
import { ClientConfig } from "./others/Config.js"
import Logger from "./others/Logger.js"

const manager = new ClusterManager("./dist/Client.js", {
    totalShards: "auto",
    totalClusters: "auto",
    shardsPerClusters: 10,
    mode: "process",
    token: ClientConfig.token,
})

manager.on("clusterCreate", cluster => Logger.cluster(`Launched Cluster ${cluster.id}`))
manager.spawn({ delay: 10000, timeout: -1 })