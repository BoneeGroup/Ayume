import { ApplicationCommandOptionType } from "discord.js"
import { Command, RunCommand } from "../../structures/Command.js"
import AyumeClient from "../../structures/AyumeClient.js"

export default class PlaylistsCommands extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "playlist",
            description: "「Playlist」- Comandos para gerenciar suas playlists.",
            category: "Playlists",
            options: [
                {
                    name: "criar",
                    description: "「Playlist」- Criar uma playlist.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "nome",
                            description: "Nome para sua playlist.",
                            required: true,
                            type: ApplicationCommandOptionType.String,
                        },
                        {
                            name: "publico",
                            description: "Sua playlist é pública?",
                            required: true,
                            type: ApplicationCommandOptionType.Boolean,
                        },
                        {
                            name: "query",
                            description: "Música ou playlist para sua playlist.",
                            required: true,
                            type: ApplicationCommandOptionType.String,
                        }
                    ],
                },
                {
                    name: "deletar",
                    description: "「Playlist」- Deletar uma playlist.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "nome",
                            description: "Nome da playlist a ser deletada.",
                            autocomplete: true,
                            required: true,
                            type: ApplicationCommandOptionType.String,
                        }
                    ]
                },
                {
                    name: "ver",
                    description: "「Playlist」- Veja suas playlists salvas.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "nome",
                            description: "Nome da playlist para ver",
                            required: true,
                            type: ApplicationCommandOptionType.String,
                        }
                    ]
                },
                {
                    name: "play",
                    description: "「Playlist」-  Coloca para tocar sua playlist.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "nome",
                            description: "Nome da playlist para tocar",
                            required: true,
                            type: ApplicationCommandOptionType.String,
                        }
                    ]
                },
                {
                    name: "playlists",
                    description: "「Playlist」- Veja todas as suas playlists salvas.",
                    type: ApplicationCommandOptionType.Subcommand,
                }
            ],
            subCommands: ["criar", "deletar", "ver", "play", "playlists"],
        })
    }

    async run({ interaction }: RunCommand) {
        
        if (interaction.options.getSubcommand() == "criar") {
            this.client.commands.get("playlist_create")!.run({ interaction })
        }
    }
}