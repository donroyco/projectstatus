'use strict';

var Promise = require('bluebird'); // for example, the Bluebird libary
var Client = Promise.promisifyAll(require('node-rest-client').Client);

module.exports = {
    getBambooStatus: getBambooStatus
};

// When running, https://bamboo.eden.klm.com/chain/admin/ajax/getChains.action?planKey=MYWP-MYWPD returns:
// {
//     "status": "OK",
//     "builds": [{
//         "status": "BUILDING",
//         "messageType": "PROGRESS",
//         "messageText": "Building for 26 secs. 21 mins remaining",
//         "hasReadPermission": true,
//         "hasBuildPermission": true,
//         "itemType": "BUILD",
//         "resultKey": "MYWP-MYWPD-1392",
//         "buildResultKey": "MYWP-MYWPD-1392",
//         "planKey": "MYWP-MYWPD",
//         "projectName": "MyWeb",
//         "chainName": "myweb continuous delivery",
//         "planName": "MyWeb - myweb continuous delivery",
//         "buildNumber": 1392,
//         "isBranch": false,
//         "triggerReason": "Updated by Peter Welp <peter.welp@klm.com>",
//         "percentageComplete": 1,
//         "stage": {
//             "name": "Build",
//             "number": 1,
//             "totalStages": 2
//         }
//     }]
// }
// or it returns
// {
//     "status": "OK",
//     "builds": []
// }
// or it might even return 
// { "status": "NOT OK? " } ofzo


function getBambooStatus(projectName) {

	var client = new Client();
	var lastStatus = 'unknown';
	var builds = client.getAsync('https://bamboo.eden.klm.com/chain/admin/ajax/getChains.action?planKey=' + projectName)
            .then(JSON.parse)
            .get("objectIds");
 
	// https://bamboo.eden.klm.com/chain/admin/ajax/getChains.action?planKey=MYWP-MYWPD
	client.get('https://bamboo.eden.klm.com/chain/admin/ajax/getChains.action?planKey=' + projectName, function (data, response) {
		//console.log(data.builds[0]);
		lastStatus = data.builds[0].status;

	});
	return lastStatus;
}

function getAverageBuildTime(projectName) {
	// Do this later, get rest details for evey result, count successfull and average buildtimes
	// Only do this when starting the process.
	var client = new Client();
	 
	client.get('https://bamboo.eden.klm.com/rest/api/latest/result/' + projectName + '.json', function (data, response) {
		// parsed response body as js object 
		//console.log(data);
		var lastBuild = data.results.result[0];
		console.log(lastBuild.state);
		return lastBuild.state;

	});
}

var client = new Client();

function FeatureService(endpoint) {

    var uniqueIds;
    var count;

    // get list of unique id's
    this.getUniqueIds = function(){
        if (!uniqueIds) { // by caching the promise itself, you won't do multiple requests
                          // even if the method is called again before the first returns
            uniqueIds = client.getAsync(endpoint + '/query', {
                parameters: {
                    f: 'json',
                    where: "OBJECTID LIKE '%'",
                    returnIdsOnly: 'true'
                }
            })
            .then(JSON.parse)
            .get("objectIds");
        }
        return uniqueIds;
    };

    // get feature count
    this.getCount = function(){
        if (!count)
            count = this.getUniqueIds() // returns a promise now!
                    .get("length");
        return count; // return a promise for the length
    };

    // get list of unique attribute values in a single field for typeahead
    this.getTypeaheadJson = function(field){};

    // find features in a field with a specific value
    this.find = function(field, value){};
};

var endpoint = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_accesses_20140712b/FeatureServer/1';
var afs = new FeatureService(endpoint);
afs.getCount().then(function(count) {
    console.log(count);
}); // you will need to use a callback to do something with async results (always!)

exports.FeatureService = FeatureService;