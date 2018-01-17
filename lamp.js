var color = process.argv[2];
var blinkstick = require('blinkstick');
var device = blinkstick.findFirst();

device.setMode(1);

device.setColor(color, function(){
    console.log(color, 'on');
    device.getColorString(function(error, result) {
        if (error) {console.log(error)}
        console.log("Color:        " + result);
    });
});