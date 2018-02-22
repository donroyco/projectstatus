'use strict';

var requestP = require('request-promise');
var q = require('q');
let cheerio = require('cheerio')

var Hostmonitor = function (config) {
    this.hostMonitorURL = config.hostmonitorurl;
    this.timeout = config.timeout;
}
// properties and methods
Hostmonitor.prototype = {
    getMonitorStatus: function() {
        
        var defer = q.defer();
        
        requestP({uri: this.hostMonitorURL,
                  json: true,
                  timeout: this.timeout,
                  resolveWithFullResponse: true,
                  headers: { 'User-Agent': 'Request-Promise', 'Accept': 'text/html'}
        })
        .then(function (result) {
            var $ = cheerio.load(result.body);

            var hostNames = [];
            var isOK = true;
            $('tr.Good').each(function(i, plan){    
                var hostName = $(this).find('a').text();
                hostNames.push({"hostName": hostName, "status": "Good"});  
            });
            $('tr.Bad').each(function(i, plan){   
                var hostName = $(this).find('a').text();
                hostNames.push({"hostName": hostName, "status": "Bad"});
                isOK = false;
            });
            if (isOK) { 
                defer.resolve({'value': 'up', 'services': hostNames});
            } else {
                defer.resolve({'value': 'down', 'services': hostNames});
            }
        })
        .catch(function (err) {
            console.log(err.message);
            defer.resolve({'value':'error', 'error': err.message});
        });

        return defer.promise;
    }
}

module.exports = Hostmonitor;

