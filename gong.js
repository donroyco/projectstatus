"use strict";

var Gong = function () {
  }

// properties and methods
Gong.prototype = {
    play: function () {
		var command = `aplay gong.wav`;

		var exec = require('child_process').execSync;
		try {
			exec(command, function(error, stdout, stderr) {});
		} catch (e) {

		}
    }
};

module.exports = Gong;
