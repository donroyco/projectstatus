'use strict';

var Client = require('node-rest-client').Client;

module.exports = {
    getBambooStatus: getBambooStatus
};

function getBambooStatus(credentials) {

	// configure basic http auth for every request 
	var options_auth = { user: "klm36583", password: "SOMETHING" };
	 
	var client = new Client(options_auth);
	 
	client.get("https://bamboo.eden.klm.com/rest/api/latest/result/MYWP-MYWPD.json", function (data, response) {
		// parsed response body as js object 
		//console.log(data);
		var lastBuild = data.results.result[0];
		console.log(lastBuild.state);
		return lastBuild.state;

	});
}


