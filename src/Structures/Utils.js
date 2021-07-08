const path = require('path')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const Command = require('./Command.js')
const Event = require('./Event.js')


module.exports = class Util {

	constructor(client) {
		this.client = client
	}

	isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class'
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`
	}

	trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen
			arr = arr.slice(0, maxLen)
			arr.push(`${len} mais...`)
		}
		return arr
	}

	formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes'
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		const i = Math.floor(Math.log(bytes) / Math.log(1024))
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
	}


	formatTime(time) {
		time = Math.round(time / 1000)
        const s = time % 60,
        m = Math.floor((time / 60) % 60),
        h = Math.floor(time / 60 / 60)
    
		return h 
		? `${String(h).length === 2 ? h : `0${h}`}:${String(m).length === 2 ? m : `0${m}`}:${String(s).length === 2 ? s : `0${s}`}` 
		: `${String(m).length === 2 ? m : `0${m}`}:${String(s).length === 2 ? s : `0${s}`}`
	}

	formatDuration(duration) {
		if(isNaN(duration) || typeof duration === undefined) return '00:00'
		if(duration > 3600000000) return 'LIVE'
		return this.formatTime(duration)
	}

	removeDuplicates(arr) {
		return [...new Set(arr)]
	}

	capitalise(string) {
		return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ')
	}

	resetVotes(player) {
		return player.skipVotes.splice(0)
	}
	
	checkOwner(target) {
		return this.client.owners.includes(target)
	}

	comparePerms(member, target) {
		return member.roles.highest.position < target.roles.highest.position
	}

	formatArray(array, type = 'conjunction') {
		return new Intl.ListFormat('en-US', { style: 'short', type: type }).format(array)
	}

	time(s) {
		function pad(n, z) {
			z = z || 2
			return ('00' + n).slice(-z)
		}
		let ms = s % 1000
		s = (s - ms) / 1000
		let secs = s % 60
		s = (s - secs) / 60
		let mins = s % 60
		let hrs = (s - mins) / 60
	
		let days = parseInt(Math.floor(hrs / 24))
		hrs = parseInt(hrs % 24)
		
		let meses = parseInt(Math.floor(days / 30))
		days = parseInt(days % 30)
		
		return (meses > 0 ? pad(meses) + 'm, ' : "") + (days > 0 ? pad(days) + 'd, ' : "") + (hrs > 0 ? pad(hrs) + 'h, ' : "") + (mins > 0 ? pad(mins) + 'm ' : "") + (pad(secs) + 's')
	}

	escapeRegex(prefix) {
	    return prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	}

	formatPerms(perm) {
		return perm
	}

	async loadCommands() {
		console.log("[BOT] - Comandos carregados".green)

		return glob(`${this.directory}/src/commands/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile]
				const { name } = path.parse(commandFile)
				const File = require(commandFile)
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`)
				const command = new File(this.client, name.toLowerCase())
				if (!(command instanceof Command)) throw new TypeError(`Comamnd ${name} doesnt belong in Commands.`)
				this.client.commands.set(command.name, command)
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name)
					}
				}
			}
		})
	}

	async loadEvents() {
		console.log("[BOT] - Eventos carregados".green)

		return glob(`${this.directory}/src/events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile]
				const { name } = path.parse(eventFile)
				const File = require(eventFile)
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`)
				const event = new File(this.client, name)
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`)
				this.client.events.set(event.name, event)
				event.emitter[event.type](name, (...args) => event.run(...args))
			}
		})
	}
}