"use strict";

var StatusLamp = function (config) {
    this.lampRedPort = config.portRed;
    this.lampGreenPort = config.portGreen;
    this.lampBluePort = config.portBlue;
    this.currentColor = 'initial';
    this.errorRelay = false;
  }

// properties and methods
StatusLamp.prototype = {
    set: function(color) {
        // use a C process to set the color
        let lColor = color.toLowerCase();
        if (color !== this.currentColor) {
    		this.currentColor = color;
            setColor(this.lampRedPort, 'off');
            setColor(this.lampGreenPort, 'off');
            setColor(this.lampBluePort, 'off');

            switch (lColor) {
                   case 'red': 
                        setColor(this.lampRedPort, 'on');
                   break;
                   case 'green': 
                        setColor(this.lampGreenPort, 'on');
                   break;
                   case 'successful': 
                        setColor(this.lampGreenPort, 'on');
                   break;
                   case 'blue': 
                        setColor(this.lampBluePort, 'on');
                   break;
                   case 'yellow': 
                        setColor(this.lampRedPort, 'on');
                        setColor(this.lampGreenPort, 'on');
                   break;
                   case 'purple': 
                        setColor(this.lampRedPort, 'on');
                        setColor(this.lampBluePort, 'on');
                   break;
                   case 'sea': 
                        setColor(this.lampGreenPort, 'on');
                        setColor(this.lampBluePort, 'on');
                   break;
                   case 'all': 
                        setColor(this.lampRedPort, 'on');
                        setColor(this.lampGreenPort, 'on');
                        setColor(this.lampBluePort, 'on');
                   break;
                   case 'off': 
                        setColor(this.lampRedPort, 'off');
                        setColor(this.lampGreenPort, 'off');
                        setColor(this.lampBluePort, 'off');
                   break;
                   //default;
            }
    	}

        var errorRelay = false;

        function setColor(lampPort, state) {
            // Do the exec
            var command = `crelay ${lampPort} ${state}`;

            if (errorRelay) {
                return;
            }

            var exec = require('child_process').execSync;
            try {
                exec(command, function(error, stdout, stderr) {});
            } catch (e) {
                errorRelay = true;
            }
        }
    }
};

module.exports = StatusLamp;
