var blinkstick = require('blinkstick');

var device = blinkstick.findFirst();

device.morph('blue', function(){
    console.log('blue on');
});
