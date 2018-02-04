"use strict";
var fs = require('fs');

var AudioService = function () {
  }

// properties and methods
AudioService.prototype = {
    play: function (what) {
			var extention = 'mp3';
			if (fs.existsSync(`./sounds/${what}.wav`)) {
				extention = 'wav';
			}

			var command = `aplay ./sounds/${what}.${extention}`;

			if (errorCommand) {
				return;
			}
			console.log('playing ', command);

			var exec = require('child_process').execSync;
			try {
				exec(command, function(error, stdout, stderr) {});
			} catch (e) {
		  	errorCommand = true;
		 }

		var errorCommand = false;
	}
};

module.exports = AudioService;
