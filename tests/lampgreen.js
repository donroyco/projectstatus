var blinkstick = require('blinkstick');

var device = blinkstick.findFirst();

device.morph('green');

