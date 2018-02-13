"use strict";
var fs = require('fs');

var AudioService = function () {
  }

// properties and methods
AudioService.prototype = {
    play: function (what) {
			var extension = 'mp3';
			if (fs.existsSync(`./sounds/${what}.wav`)) {
				extension = 'wav';
			}

			var command = `aplay ./sounds/${what}.${extension}`;

			if (errorCommand) {
				return;
			}

			var exec = require('child_process').exec;
			try {
				exec(command, function(error, stdout, stderr) {});
			} catch (e) {
		  	errorCommand = true;
		 }

		var errorCommand = false;
	}
};

module.exports = AudioService;
