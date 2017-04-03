"use strict";

var Gong = function () {
  }

// properties and methods
Gong.prototype = {
    play: function () {
		var command = `omxplayer gong.mp3`;

		var exec = require('child_process').execSync;
		try {
			exec(command, function(error, stdout, stderr) {});
		} catch (e) {

		}
    }
};

module.exports = Gong;
