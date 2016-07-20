"use strict";
var q = require('q');

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
        let buzzer = this.onAndWait()
                .then(this.offAndWait)
                .then(this.onAndWait)
                .then(() => {
                    this.buzzOff
                    });
    },
    onAndWait: function() {
        this.buzzOn();
        return new Promise((resolve) => setTimeout(resolve, 500));
    },
    offAndWait: function() {
        this.buzzOff();
        return new Promise((resolve) => setTimeout(resolve, 500));
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
