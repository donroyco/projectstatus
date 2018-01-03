var blinkstick = require('blinkstick');

var device = blinkstick.findFirst();

device.blink('random', function(){
    device.pulse('random', function(){
        device.setColor('red', function(){
        });
    });
});