import { Awaitable } from "discord.js"
import AyumeClient from "./AyumeClient.js"


interface EventOptions {
    name: string
}

export default class Event {

    client: AyumeClient
	name: string

	constructor(client: AyumeClient, options: EventOptions) {
        
		this.name = options.name
		this.client = client
	}


	run(...args: unknown[]): Awaitable<any> {
		return { args }
	}
}