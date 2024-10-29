import { KazagumoTrack } from "kazagumo"
import { Command, RunCommand } from "../../../structures/Command.js"
import AyumeClient from "../../../structures/AyumeClient.js"

export default class PlaylistsCreateSubCommand extends Command {
    constructor(client: AyumeClient) {
        super(client, {
            name: "playlist_create",
            description: ".",
            category: "Playlists",
            showInHelp: false,
            isSubCommand: true
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ fetchReply: true })

        const data = await this.client.db.playlist.findUnique({ where: { userId: interaction.user.id } })

        const options = {
            query: interaction.options.getString("query", true),
            public: interaction.options.getBoolean("publico", true),
            name: interaction.options.getString("nome", true)
        }

        const songsToAdd = {
            name: options.name,
            songs: [] as string[]
        }

        const results = await this.client.lava.search(options.query)
        
        results.tracks.forEach(track => {
            songsToAdd.songs.push(JSON.stringify(track))
        })

        
    }
}