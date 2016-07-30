"use strict";

var Speaker = function (config) {
    this.voice = config.voice || 'rms' ;
  }

// properties and methods
Speaker.prototype = {
    say: function(message) {
        // use a C process to say the words
        sayText(message, this.voice);
    	}

        function sayText(message, voice) {
            // Do the exec
            var command = `flite -voice ${voice} -t ${message}`;

            var exec = require('child_process').execSync;
            try {
                exec(command, function(error, stdout, stderr) {});
            } catch (e) {

            }
        }
    }
};

module.exports = Speaker ;
