"use strict";

var Gong = function () {
  }

// properties and methods
Gong.prototype = {
    play: function (what) {
			var command = `aplay /sounds/${what}.wav`;
			console.log('playing ', command);

			var exec = require('child_process').execSync;
			try {
				exec(command, function(error, stdout, stderr) {});
			} catch (e) {

		}
    }
};

module.exports = Gong;
