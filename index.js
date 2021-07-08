require("colors")
console.log("[LOGIN] - Iniciando bot".green)

const AyumeClient = require("./src/Structures/AyumeClient")
const Loader = require("./src/Structures/Loader")
const config = require("./src/System/Config")
const client = new AyumeClient(config)
new Loader(client).start()

client.connect()