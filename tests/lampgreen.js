var blinkstick = require('blinkstick');

var device = blinkstick.findFirst();

device.setColor('green', function(){
    console.log('green on');
});