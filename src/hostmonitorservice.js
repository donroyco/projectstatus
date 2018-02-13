'use strict';

var requestP = require('request-promise');
var q = require('q');
let cheerio = require('cheerio')

var Hostmonitor = function (config) {
    this.hostMonitorURL = config.hostMonitorURL;
    this.timeout = config.timeout;
}
// properties and methods
Hostmonitor.prototype = {
    getMonitorStatus: function() {
        
        var defer = q.defer();
        
        console.log(this.hostMonitorURL);
        requestP({uri: this.hostMonitorURL,
                  json: true,
                  timeout: this.timeout,
                  resolveWithFullResponse: true,
                  headers: { 'User-Agent': 'Request-Promise', 'Accept': 'text/html'}
        })
        .then(function (html) {
            var $ = cheerio.load(html);

            var hostNames = {};
            var isOK = true;
            console.log($('.Good').length);
            console.log('anyength', $('tr').toArray()); 
            $('tr').each(function() {
                console.log($('good', this));
            }); 
            console.log('Goodlength', $('tbody tr.good').length); 
            $('tbody tr.Good').each(function(i, plan){    
                var hostName = $(this).find('a').text();
                hostNames.push({"hostName": hostName, "status": "Good"});  
            });
            console.log('Badlength', $('tr.Bad').length); 
            $('tr.Bad').each(function(i, plan){   
                var hostName = $(this).find('a').text();
                hostNames.push({"hostName": hostName, "status": "Bad"});
                isOK = false;
            });
            console.log(hostNames);
            if (isOK) { 
                defer.resolve({'value': 'up', 'info': hostNames});
            } else {
                defer.resolve({'value': 'down', 'info': 'down'});
            }
        })
        .catch(function (err) {
            console.log(err.message);
            defer.resolve({'value':'error', 'info': err.message});
        });

        return defer.promise;
    }
}

module.exports = Hostmonitor;

