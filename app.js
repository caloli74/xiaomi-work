const Xiaomi = require('./lib/Xiaomi.js');

var xiaomi = new Xiaomi('wkj8q0gi2nmaugth');
xiaomi.on('ready', () => {
    //xiaomi.playSound(12);
    //xiaomi.setColor({intensity:20, r:0, g:255, b:0});
    console.log('xiaomi ready');
});

xiaomi.on('message', (msg) => {
    //xiaomi.playSound(12);
    //xiaomi.setColor({intensity:20, r:0, g:255, b:0});
    console.log((new Date).toLocaleTimeString() + '' + JSON.stringify(msg));
});
