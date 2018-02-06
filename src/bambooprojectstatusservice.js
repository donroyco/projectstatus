'use strict';

var requestP = require('request-promise');
var q = require('q');
let cheerio = require('cheerio')
let plansToIgnore = ['BW-BWAPINIG', 'BW-AE2ENIG'];
 
var BambooStatus = function (config) {
    this.bambookey = config.bambookey;
    this.bambooURL = config.bambooURL;
    this.bambooMostImportantPlan = config.bambooMostImportantPlan;
}

// properties and methods
BambooStatus.prototype = {
    getBambooStatus: function () {
        var defer = q.defer();

        var lastStatus = 'unknown';
        // see if building
        requestP(uriWithOptionForJason(`${this.bambooURL}${this.bambookey}`))
        .then(function (html) {
            var $ = cheerio.load(html);
            var isBuilding =  false;
            var isFailed = false;
            var isMostImportantPlanFailed = false;
            
            var planNames = {};
            $('.result').each(function(i, plan){    
                var planName = $(this).find('a').text();
                var planCode = $(this).find('a').attr('href').replace('/browse/', '');
                if ($(this).find('.build-details .indicator').hasClass('building')) {
                    planNames[planCode] = {"planName": planName,
                                           "status": "building"};  
                    isBuilding = true;
                }
            });

            $('.result.Failed').each(function(i, plan){  
                var planName = $(this).find('a').text();
                var planCode = $(this).find('a').attr('href').replace('/browse/', '');
                if (plansToIgnore.indexOf(planCode) === -1) {
                    // Not say failed if it is currently building
                    if (planNames[planCode] === undefined) {
                        planNames[planCode] = {"planName": planName,
                        "status": "failed"}; 
                        if (planCode === this.bambooMostImportantPlan) {
                            isMostImportantPlanFailed = true;
                        }
                        isFailed = true;
                    }
                 }
            });

            if (isBuilding) {
                defer.resolve({'status': 'building', 'planstatus': planNames});
        	} else if (isFailed) {
                if (isMostImportantPlanFailed) {
                    defer.resolve({'status': 'failedMIP', 'planstatus': planNames});
                } else {
                    defer.resolve({'status': 'failed', 'planstatus': planNames});
                }
        	} else {
                defer.resolve({'status': 'successful', 'planstatus': {}});
        	}
        })
        .catch(function (err) {
            // parsing failed 
            console.log('error index: ', err);
            defer.resolve({'status': 'error', 'info': err.message, 'planstatus': {}});
        });

        return defer.promise;
    }
}

function uriWithOptionForJason(uri) {
    return  {
        uri: uri,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response 
    };
}

module.exports = BambooStatus;
