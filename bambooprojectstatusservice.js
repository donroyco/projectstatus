'use strict';

var requestP = require('request-promise');
var q = require('q');
let cheerio = require('cheerio')
 
var BambooStatus = function (config) {
    this.bambookey = config.bambookey;
}

// properties and methods
BambooStatus.prototype = {
    getBambooStatus: function () {
        var defer = q.defer();
        var bambookey = this.bambookey;

        var lastStatus = 'unknown';
        // see if building
        requestP(uriWithOptionForJason(`https://bamboo.eden.klm.com/telemetry.action?filter=project&projectKey=${bambookey}`))
        .then(function (html) {
            var $ = cheerio.load(html);
            var isBuilding =  $('.build-details .indicator').hasClass('building');
            var isFailed = $('.result ').hasClass('Failed');

        	if (isBuilding) {
                defer.resolve({'value': 'building', 'info': 'building', 'reason': 'komt nog'});
        	} else if (isFailed) {
                var reasonFailure = 'failed';
                var failureInfo = 'unknown error';
                
                var failedBuilds = $('.result.Failed');
                if (failedBuilds.length === 1) {
                    if (failedBuilds.find('a').attr('href').indexOf('BW-BWAPINIG') > -1) {
                        reasonFailure = 'nightly';         
                        failureInfo = 'Load test Failed';
                    }
                }

                defer.resolve({'value': reasonFailure, 'info': failureInfo, 'reason': 'unkown'});
        	} else {
                defer.resolve({'value': 'successful', 'info': 'TODO', 'reason': 'unkown'});
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
    var posBefore = buildReason.indexOf('>') + 1;
    var posAfter = buildReason.indexOf(',');
    var name2blame = buildReason.substr(posBefore, posAfter - posBefore);
    console.log(buildReason, posBefore , posAfter, name2blame);
    return name2blame;
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
