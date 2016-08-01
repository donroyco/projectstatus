'use strict';

var requestP = require('request-promise');
var q = require('q');

var BambooStatus = function (projectName) {
    this.projectName = projectName;
}

// properties and methods
BambooStatus.prototype = {
    getBambooStatus: function () {
        var defer = q.defer();
        var projectName = this.projectName;

        var lastStatus = 'unknown';
        // see if building
        requestP(uriWithOptionForJason(`https://bamboo.eden.klm.com/chain/admin/ajax/getChains.action?planKey=${projectName}`))
        .then(function (bamboo) {
        	if (bamboo.builds[0] && bamboo.builds[0].status === 'BUILDING') {
                defer.resolve({'value': 'building', 'info': 'building', 'reason': bamboo.builds[0].triggerReason});
        	} else {
        		// see list of last builds
        		requestP(uriWithOptionForJason(`https://bamboo.eden.klm.com/rest/api/latest/result/${projectName}.json`))
        		.then(function (lastRuns) {
    	    		// see details of last build
        			if (lastRuns.results.result[0].link.href) {
        				requestP(uriWithOptionForJason(lastRuns.results.result[0].link.href))
        				.then(function(result) {
        					//console.log(`Build ${result.buildState}, ${result.buildRelativeTime}, took ${result.buildDurationDescription} `);
        					defer.resolve({'value': result.buildState.toLowerCase(),
                                'info': `Build ${result.buildState}, ${result.buildRelativeTime}, took ${result.buildDurationDescription} `,
                                'reason': blameName(result.buildReason)});
        				})
        			} else {
                        defer.resolve({'value': 'error', 'info': 'unknown error', 'reason': 'unkown'});
                    }
        		})
        	}
        })
        .catch(function (err) {
            // parsing failed 
            console.log('error index: ', err);
            defer.resolve({'value': 'error', 'info': err.message, 'reason': 'unkown'});
        });

        return defer.promise;
    }
}

function blameName(buildReason) {
    console.log(buildReason);
    return buildReason.replace(/.*\<|\>/gi,'');
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

module.exports = BambooStatus;

// function getAverageBuildTime(projectName) {
// 	// Do this later, get rest details for evey result, count successfull and average buildtimes
// 	// Only do this when starting the process.
// }
