"use strict";

var StatusBuzzer = function (port) {
    this.buzzerPort = port;
  }

// properties and methods
StatusBuzzer.prototype = {
    buzzOn: function () {
		setBuzz(this.buzzerPort, 'on');    	
    },
    buzzOff: function () {
		setBuzz(this.buzzerPort, 'off');    	
    },
    buzz: function(howLong) {
        this.buzzOn();
        setTimeout(this.buzzOff.bind(this), howLong);
        setTimeout(this.buzzOn.bind(this), howLong * 2);
        setTimeout(this.buzzOff.bind(this), howLong * 3);
    }

};

var errorRelay = false;

function setBuzz(port, state) {
    // Do the exec
    var command = `crelay ${port} ${state}`;

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

module.exports = StatusBuzzer;
