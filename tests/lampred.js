var blinkstick = require('blinkstick');

var device = blinkstick.findFirst();

device.setColor('red', function(){
    console.log('red on');
});