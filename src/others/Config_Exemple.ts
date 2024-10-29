import { HexColorString, PermissionFlagsBits, PermissionResolvable } from "discord.js"
import { NodeOption } from "shoukaku"

export const ClientConfig = {
    token: "",
    prefix: "/",
    owners: [""],
    defaultColor: "#4eacb9" as HexColorString,
    defaultPerms: [
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
    ] as PermissionResolvable[],
    clientId: "",
    development: true
}

export const Webhook = ""

export const GeniusToken = ""

export const Nodes = [
    {
        name: "Hiratsu",
        auth: "youshallnotpass",
        group: "Production",
        url: "localhost:2333",
        secure: false,
    }
] as NodeOption[]