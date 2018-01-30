"use strict";

var Speaker = function (config) {
    this.voice = config.voice || 'rms' ;
  }

// properties and methods
Speaker.prototype = {
    say: function(message, voice) {
        var useVoice = voice || this.voice;
        var command = `flite -voice ${useVoice} -t '${message}'`;
	console.log('executing ', command);

        var exec = require('child_process').execSync;
        try {
            exec(command, function(error, stdout, stderr) {});
        } catch (e) {

        }
    }
};

module.exports = Speaker ;
