'use strict';

var requestP = require('request-promise');

function getBambooStatus(projectName) {

	var lastStatus = 'unknown';
	console.log('see if building');
    requestP(uriWithOptionForJason(`https://bamboo.eden.klm.com/chain/admin/ajax/getChains.action?planKey=${projectName}`))
    .then(function (bamboo) {
    	if (bamboo.builds.length !== 0) {
			console.log(bamboo.builds);
    		lastStatus = 'building';
    	} else {
    		console.log('see list of last builds');
    		requestP(uriWithOptionForJason(`https://bamboo.eden.klm.com/rest/api/latest/result/${projectName}.json`))
    		.then(function (lastRuns) {
	    		console.log('see details of last build');
    			if (lastRuns.results.result[0].link.href) {
    				requestP(uriWithOptionForJason(lastRuns.results.result[0].link.href))
    				.then(function(result) {
    					console.log(`Build ${result.buildState}, ${result.buildRelativeTime}, took ${result.buildDurationDescription} `);
    					lastStatus = result.buildState;
    				})
    			}
    		})
    	}
    })
    .catch(function (err) {
        // parsing failed 
        console.log('error index: ', err);
    });

    console.log('end of module now what');
    return lastStatus;

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

	// });
}
