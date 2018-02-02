var blinkstick = require('blinkstick');

var device = blinkstick.findFirst();

device.morph('red', function(){
    console.log('red on');
});
