'use strict';

var requestP = require('request-promise');
var q = require('q');

var HealthStatus = function (config) {
    this.healthURL = config.healthURL;
    this.timeout = config.timeout;
}
// properties and methods
HealthStatus.prototype = {
        getHealthStatus: function() {

        var defer = q.defer();

        requestP({uri: this.healthURL, resolveWithFullResponse: true, timeout: this.timeout })
        .then(function (response) {
            if (response.socket._host && response.socket._host == 'sorry.klm.com') { // redirect to sorry page
                defer.resolve({'value': 'error', 'info': 'unavailable'});
            } else if (response.statusCode && response.statusCode < 400) {
                defer.resolve({'value': 'up', 'info': 'up'});
            } else {
                defer.resolve({'value': 'down', 'info': 'down'});
            }
        })
        .catch(function (err) {
            defer.resolve({'value':'error', 'info': err.message});
        });

        return defer.promise;
    }
}

module.exports = HealthStatus;

