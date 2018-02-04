
"use strict";

var LightSaber = function (deviceNumber) {
    this.currentColor = 'initial';
    var Blinkstick = require('blinkstick');
    
    this.device = Blinkstick.findAll()[deviceNumber];
    if (!this.device) {
        console.log('blinkstick not found');
        throw `Blinkstick ${deviceNumber} not found!`;
    }
    this.device.setMode(1);
  }

// properties and methods
LightSaber.prototype = {
    set: function(color) {
        if (color !== this.currentColor) {
            this.currentColor = color;
            this.device.morph(color);
    	} 
    }
};

module.exports = LightSaber;
