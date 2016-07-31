"use strict";

var Speaker = function (config) {
    this.voice = config.voice || 'rms' ;
  }

// properties and methods
Speaker.prototype = {
    say: function(message) {
        var command = `flite -voice ${this.voice} -t ${message}`;

        var exec = require('child_process').execSync;
        try {
            exec(command, function(error, stdout, stderr) {});
        } catch (e) {

        }
    }
};

module.exports = Speaker ;
