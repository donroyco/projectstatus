
"use strict";

var LightSaber = function (deviceNumber) {
    this.currentColor = 'initial';
    var Blinkstick = require('blinkstick');
    
    this.device = Blinkstick.findAll()[deviceNumber];
    if (!this.device) {
        console.log('blinkstick not found');
        // throw `Blinkstick ${deviceNumber} not found!`;
        this.device = {
            setColor (color) {
              console.log('dummy blinkstick set to color ', color);
            },
            morph (color) {
                console.log('dummy blinkstick morphed to color ', color);
              },
              setMode (mode) {}
            };
    }
    this.device.setMode(1);
  }

// properties and methods
LightSaber.prototype = {
    set: function(color, immediate) {
        if (color !== this.currentColor) {
            this.currentColor = color;
            if (immediate) {
                this.device.setColor(color);
            } else {
                this.device.morph(color);
            }
    	} 
    }
};

module.exports = LightSaber;
