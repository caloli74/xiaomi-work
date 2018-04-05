const crypto = require('crypto');
const GenericDevice = require('./GenericDevice.js');
const AQARA_IV = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e]);

module.exports = class Gateway extends GenericDevice {
    constructor(sid, model, parent) {
        super(sid, model, parent);
        this.parent.sendSocket({ cmd: "get_id_list", sid: sid });
        this.parent.sendSocket({ cmd: "read", sid: sid });
        this.token = '';
        this.illumination = 0;
        this.rgb = 0;
    }

    playSound(sound) {
        var data = JSON.stringify({ mid: sound, key: this._calculateKey() });
        this._writeGateway(data);
    }

    setColor(color) {
        const value = color.intensity * Math.pow(2, 24) + color.r * Math.pow(2, 16) + color.g * Math.pow(2, 8) + color.b;
        var data = JSON.stringify({ rgb: value, key: this._calculateKey() });
        this._writeGateway(data);
    }

    onMessage(msg) {
        if (msg.token)
            this.token = msg.token;

        switch (msg.cmd) {
            case 'get_id_list_ack':
                for (var sid of JSON.parse(msg.data)) {
                    this.parent.sendSocket({ cmd: "read", sid: sid });
                }
                if (!this.parent.started) {
                    this.parent.started = true;
                    // first time get_id_list_ack, notifiy class is ready
                    this.parent.emit('ready');
                }
                break;

            case 'report':
            case 'read_ack':
            case 'write_ack':
                // notifiy only in case of change
                if (this.illumination != JSON.parse(msg.data).illumination || this.rgb != JSON.parse(msg.data).rgb) {
                    this.illumination = JSON.parse(msg.data).illumination;
                    this.rgb = JSON.parse(msg.data).rgb
                    this.parent.emit('message', { model: this.model, sid: this.sid, illumination: this.illumination, rgb: this.rgb });
                }
                break;
        }
    }

    // ---------- private methods ----------
    _writeGateway(data) {
        this.parent.sendSocket({ cmd: "write", model: "gateway", sid: this.sid, short_id: 0, data: data });
    }

    _calculateKey() {
        const cipher = crypto.createCipheriv('aes-128-cbc', this.parent.password, AQARA_IV);
        return cipher.update(this.token, 'ascii', 'hex');
    };
}