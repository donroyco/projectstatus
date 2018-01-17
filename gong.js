"use strict";
var fs = require('fs');

var Gong = function () {
  }

// properties and methods
Gong.prototype = {
    play: function (what) {
			var extention = 'mp3';
			if (fs.existsSync(`./sounds/${what}.wav`)) {
				extention = 'wav';
			}

			var command = `aplay ./sounds/${what}.${extention}`;
			console.log('playing ', command);

			var exec = require('child_process').execSync;
			try {
				exec(command, function(error, stdout, stderr) {});
			} catch (e) {

		}
    }
};

module.exports = Gong;
