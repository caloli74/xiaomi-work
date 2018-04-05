module.exports = class GenericDevice {
    constructor(sid, model, parent) {
        this.sid = sid;
        this.model = model;
        this.parent = parent;
    }

    onMessage(msg) {

    }

}