"use strict";

var StatusLamp = function (startPort) {
    this.lampRed = startPort;
    this.lampGreen = startPort +1;
    this.lampBlue = startPort +2;
    this.currentColor = 'off';
  }

// properties and methods
StatusLamp.prototype = {
    set: function(color) {
        // Somehow use a C process to set the color
        let lColor = color.toLowerCase();
        if (color !== this.currentColor) {
		this.currentColor = color;
        setColor(this.lampRed, 'off');
        setColor(this.lampGreen, 'off');
        setColor(this.lampBlue, 'off');

        switch (lColor) {
               case 'red': 
                    setColor(this.lampRed, 'on');
               break;
               case 'green': 
                    setColor(this.lampGreen, 'on');
               break;
               case 'successful': 
                    setColor(this.lampGreen, 'on');
               break;
               case 'blue': 
                    setColor(this.lampBlue, 'on');
               break;
               case 'yellow': 
                    setColor(this.lampRed, 'on');
                    setColor(this.lampGreen, 'on');
               break;
               case 'purple': 
                    setColor(this.lampRed, 'on');
                    setColor(this.lampBlue, 'on');
               break;
               case 'sea': 
                    setColor(this.lampGreen, 'on');
                    setColor(this.lampBlue, 'on');
               break;
               case 'all': 
                    setColor(this.lampRed, 'on');
                    setColor(this.lampGreen, 'on');
                    setColor(this.lampBlue, 'on');
               break;
               case 'off': 
                    setColor(this.lampRed, 'off');
                    setColor(this.lampGreen, 'off');
                    setColor(this.lampBlue, 'off');
               break;
               //default;
        }
	}

        function setColor(lampColor, state) {
            // Do the exec
            var command = `crelay ${lampColor} ${state}`;

            var exec = require('child_process').execSync;
            try {
                exec(command, function(error, stdout, stderr) {});
            } catch (e) {

            }

        }
    }
};

module.exports = StatusLamp;
