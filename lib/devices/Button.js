const GenericDevice = require('./GenericDevice.js');

module.exports = class Button extends GenericDevice {
    constructor(sid, model, parent) {
        super(sid, model, parent);
        this.lastStatus = '';
        // notifiy when device is detected, with no status
        this.parent.emit('message', { model: this.model, sid: this.sid, status: '' });
    }

    onMessage(msg) {
        // notifiy status
        if (msg.cmd == 'report') {
            this.lastStatus = JSON.parse(msg.data).status;
            this.parent.emit('message', { model: this.model, sid: this.sid, status: this.lastStatus });
        }
    }
}