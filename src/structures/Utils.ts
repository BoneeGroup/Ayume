import { parse } from "path"
import { glob } from "glob"
import { GuildMember } from "discord.js"
import { KazagumoPlayer } from "kazagumo"

import { Command } from "./Command.js"
import Event from "./Event.js"
import AyumeClient from "./AyumeClient.js"
import Logger from "../others/Logger.js"
import { ClientConfig } from "../others/Config.js"
import { inspect } from "util"

export default class Util {

    client: AyumeClient

    constructor(client: AyumeClient) {
        this.client = client
    }

    isClass(input: Function | object): boolean {
        return (
            typeof input === "function" &&
            typeof input.prototype === "object" &&
            input.toString().substring(0, 5) === "class"
        )
    }

    formatPerms(perms: string) {
        return perms.replace("_", " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    }

    trimArray(arr: unknown[], maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen
            arr = arr.slice(0, maxLen)
            arr.push(`${len} mais...`)
        }
        return arr
    }

    formatBytes(bytes: number) {
        if (bytes === 0) return "0 Bytes"
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
    }

    removeDuplicates(arr: string[]) {
        return [...new Set(arr)]
    }

    capitalize(string: string) {
        return string
            .split(" ")
            .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
            .join(" ")
    }

    checkOwner(target: string) {
        return this.client.data.owners.includes(target)
    }

    comparePerms(member: GuildMember, target: GuildMember) {
        return member.roles.highest.position < target.roles.highest.position
    }

    async fetchUsers(ids: string[], tagOnly?: boolean) {
        const users = []
        for (const id of ids ?? this.client.data.owners) {
            const user = await this.client.users.fetch(id)
            if (tagOnly) {
                users.push(user ? `**${user.username}**#${user.discriminator}` : "unknown")
            } else {
                users.push(user.toString())
            }
        }

        return users.join(", ")
    }

    formatTime(time: number) {
        time = Math.round(time / 1000)
        const s = time % 60,
            m = Math.floor((time / 60) % 60),
            h = Math.floor(time / 60 / 60)

        return h
            ? `${String(h).length === 2 ? h : `0${h}`}:${String(m).length === 2 ? m : `0${m}`}:${String(s).length === 2 ? s : `0${s}`}`
            : `${String(m).length === 2 ? m : `0${m}`}:${String(s).length === 2 ? s : `0${s}`}`
    }

    formatDuration(duration: number) {
        if (isNaN(duration) ?? typeof duration == undefined) return "00:00"
        if (duration > 3600000000) return "LIVE"
        return this.formatTime(duration)
    }

    getQueueDuration(player: KazagumoPlayer) {
        if (!player.queue.totalSize) return player.queue.current!.length ?? 0
        // @ts-ignore
        return player.queue.reduce((prev, curr) => prev + curr!.length, 0) + player.queue.current!.length
    }

    time(s: number) {
        function pad(n: number, z?: number) {
            z = z ?? 2
            return ("00" + n).slice(-z)
        }
        let ms = s % 1000
        s = (s - ms) / 1000
        let secs = s % 60
        s = (s - secs) / 60
        let mins = s % 60
        let hrs = (s - mins) / 60

        let days = Number(Math.floor(hrs / 24))
        hrs = Number(hrs % 24)

        let meses = Number(Math.floor(days / 30))
        days = Number(days % 30)

        return (meses > 0 ? pad(meses) + "m, " : "") + (days > 0 ? pad(days) + "d, " : "") + (hrs > 0 ? pad(hrs) + "h, " : "") + (mins > 0 ? pad(mins) + "m " : "") + (pad(secs) + "s")
    }

    async postCommands() {

        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        const command = this.client.commands.map(cmd => cmd.data)

        for (const cmd of command) {

            try {
                if (cmd.postCommand == true) {

                    await sleep(2000)
                    const res = await fetch(`https://discord.com/api/v10/applications/${this.client.data.clientId}/commands`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bot ${ClientConfig.token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(cmd)
                    })

                    if (res.status == 400) {
                        Logger.error(`Failed to post command: ${cmd.name}`)
                        console.log(JSON.parse(inspect(await res.json(), { depth: 1 })))
                    } else {
                        Logger.post(`Success when posting command ${cmd.name}: ${res.status}`)
                    }
                }
            } catch (e) {
                Logger.error(`Failed to post command: ${cmd.name}`)
                console.log(e)
            }
        }
    }

    async loadCommands() {

        const commands = await glob(`./dist/commands/**/*.js`, { absolute: true })

        Logger.info(`Loading a total of ${commands.length} commands`)

        for (const commandFile of commands) {

            const { name } = parse(commandFile)
            try {

                const rawFile = await import(`file://${commandFile}`)
                const File = rawFile.default

                if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`)

                const command = new File(this.client, name.toLowerCase())

                if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands.`)
                Logger.log(`Loaded Command: ${name}`)

                this.client.commands.set(command.data.name, command)

            } catch (e) {
                Logger.error(`Unable to load command ${name}: ${e}`)
            }
        }
    }

    async loadEvents() {

        const events = await glob(`./dist/events/**/*.js`, { absolute: true })

        Logger.info(`Loading a total of ${events.length} events`)

        for (const eventFile of events) {
            const { name } = parse(eventFile)

            try {

                const rawFile = await import(`file://${eventFile}`)
                const File = rawFile.default
                if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn"t export a class.`)

                const event = new File(this.client, name.toLowerCase())
                if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesnt belong in Commands.`)
                this.client.events.set(event.name, event)

                this.client.on(event.name, (...rest: unknown[]) => event.run(...rest))
                Logger.log(`Loaded Event: ${name}`)

            } catch (e) {
                Logger.error(`Unable to load event ${name}: ${e}`)
            }
        }
    }
}