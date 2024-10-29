import { PermissionResolvable, ChatInputCommandInteraction, Awaitable, AutocompleteInteraction, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js"
import AyumeClient from "./AyumeClient.js"


interface CommandOptions extends RESTPostAPIChatInputApplicationCommandsJSONBody {
    subCommands?: unknown[]
    usage?: string
    category?: string
    userPerms?: PermissionResolvable[]
    botPerms?: PermissionResolvable[]
    ownerOnly?: boolean
    showInHelp?: boolean
    isSubCommand?: boolean
    postCommand?: boolean
    djOnly?: boolean
}

export class Command {

    data: CommandOptions
    client: AyumeClient
    subCommands?: unknown[]
    usage?: string
    category: string
    userPerms: PermissionResolvable[]
    botPerms: PermissionResolvable[]
    ownerOnly: boolean
    showInHelp: boolean
    isSubCommand: boolean
    postCommand: boolean
    djOnly: boolean

    constructor(client: AyumeClient, options: CommandOptions) {

        this.client = client
        this.data = options
        this.subCommands = options.subCommands
        this.usage = options.usage
        this.category = options.category ?? "Utilitários"
        this.userPerms = options.userPerms ?? []
        this.botPerms = options.botPerms ?? []
        this.ownerOnly = options.ownerOnly ?? false
        this.showInHelp = options.showInHelp ?? true
        this.isSubCommand = options.isSubCommand ?? false
        this.postCommand = options.postCommand ?? false
        this.djOnly = options.djOnly ?? false
    }

    run({ interaction }: RunCommand): Awaitable<unknown> {
        return { interaction }
    }

    runAutoComplete({ interaction }: RunAutoComplete): Awaitable<unknown> {
        return { interaction }
    }
}


export type RunCommand = {
    interaction: ChatInputCommandInteraction,
}

export type RunAutoComplete = {
    interaction: AutocompleteInteraction,
}