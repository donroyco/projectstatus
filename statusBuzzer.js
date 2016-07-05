"use strict";

var StatusBuzzer = function (port) {
    this.buzzerPort = port;
  }

// properties and methods
StatusBuzzer.prototype = {
    buzzOn: function () {
		console.log('buzzer on', this.buzzerPort);
		setBuzz(this.buzzerPort, 'on');    	
    },
    buzzOff: function () {
		console.log('buzzer off', this.buzzerPort);
		setBuzz(this.buzzerPort, 'off');    	
    },
    buzz: function(howLong) {
        this.buzzOn();
        setTimeout(this.buzzOff.bind(this), howLong);
    }

};

function setBuzz(port, state) {
    // Do the exec
    var command = `crelay ${port} ${state}`;

    var exec = require('child_process').execSync;
    try {
        exec(command, function(error, stdout, stderr) {});
    } catch (e) {

    }

}



module.exports = StatusBuzzer;
