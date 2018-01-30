var blinkstick = require('blinkstick');

var device = blinkstick.findFirst();

device.setColor('blue', function(){
    console.log('blue on');
});