'use strict';

var requestP = require('request-promise');
var q = require('q');

function getBambooStatus(projectName) {

    var defer = q.defer();

	var lastStatus = 'unknown';
	// see if building
    requestP(uriWithOptionForJason(`https://bamboo.eden.klm.com/chain/admin/ajax/getChains.action?planKey=${projectName}`))
    .then(function (bamboo) {
    	if (bamboo.builds.length !== 0) {
            defer.resolve('building');
    	} else {
    		// see list of last builds
    		requestP(uriWithOptionForJason(`https://bamboo.eden.klm.com/rest/api/latest/result/${projectName}.json`))
    		.then(function (lastRuns) {
	    		// see details of last build
    			if (lastRuns.results.result[0].link.href) {
    				requestP(uriWithOptionForJason(lastRuns.results.result[0].link.href))
    				.then(function(result) {
    					console.log(`Build ${result.buildState}, ${result.buildRelativeTime}, took ${result.buildDurationDescription} `);
    					defer.resolve(result.buildState.toLowerCase());
    				})
    			} else {
                    defer.resolve('unknown');
                }
    		})
    	}
    })
    .catch(function (err) {
        // parsing failed 
        console.log('error index: ', err);
        defer.reject(err);
    });

    return defer.promise;
}

function uriWithOptionForJason(uri) {
    return  {
        uri: uri,
        // qs: {
        //     access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx' 
        // },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response 
    };
}

module.exports = {
    getBambooStatus: getBambooStatus
};

function getAverageBuildTime(projectName) {
	// Do this later, get rest details for evey result, count successfull and average buildtimes
	// Only do this when starting the process.
}
