const Event = require("../../Structures/Event")

module.exports = class extends Event {

    async run(r) {
        if(this.client.music) this.client.music.updateVoiceState(r);
    }
}