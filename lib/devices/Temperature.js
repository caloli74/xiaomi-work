const GenericDevice = require('./GenericDevice.js');

module.exports = class Temperature extends GenericDevice {
    constructor(sid, model, parent) {
        super(sid, model, parent);
        this.temperature = 0;
        this.humidity = 0;
    }

    onMessage(msg) {
        if (msg.cmd == 'report' || msg.cmd == 'read_ack') {
            var data = JSON.parse(msg.data);
            // notifiy only in case of change
            if ((data.humidity && this.humidity != data.humidity / 100) || (data.temperature && this.temperature != data.temperature / 100)) {
                if (data.temperature)
                    this.temperature = data.temperature / 100;
                if (data.humidity)
                    this.humidity = data.humidity / 100;
                this.parent.emit('message', { model: this.model, sid: this.sid, temperature: this.temperature, humidity: this.humidity });
            }
        }
    }
}