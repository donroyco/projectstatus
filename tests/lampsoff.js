var blinkstick = require('blinkstick');

var device = blinkstick.findFirst();

device.setColor('red', function(){
    device.setColor('green', function(){
        device.setColor('blue', function(){
            device.turnOff();
        });
    });
});
